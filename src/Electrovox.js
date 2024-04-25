import Bullet from "./Bullet";
export default class Electrovox extends Phaser.Physics.Matter.Sprite {

    constructor(data) {
        let { scene, x, y, texture, team, lane, waypoints } = data;
        super(scene.matter.world, x, y, texture);
        this.team = team;
        this.scene.add.existing(this);
        this.waypoints = waypoints;
        this.currentWaypointIndex = 0;
        this.moveSpeed = 2;

        this.maxHealth = 50;
        this.currentHealth = this.maxHealth;
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();

        this.attackRange = 192; // Attack range in pixels
        this.shootingCooldown = 1500; // Cooldown in milliseconds
        this.lastShotTime = 0; 
        this.bulletSpeed = 8;
        this.bulletDamage = 20;
        this.bulletLifetime = 500;

        this.isHidden = false;
    }
    static preload(scene) {
        scene.load.image('electrovoxRedTeam', 'assets/images/ElectrovoxRedTeam.png');
        scene.load.image('electrovoxBlueTeam', 'assets/images/ElectrovoxBlueTeam.png');
    }
    update(time, delta) {
        if (!this.active) return;  // Skip updating if not active

        this.flipX = (this.body.velocity.x < 0);  // Flip sprite based on horizontal movement
        
        if (!this.detectAndShoot(time)) {
            // Move towards waypoints if no enemy to shoot
            if (this.waypoints && this.currentWaypointIndex < this.waypoints.length) {
                let target = this.waypoints[this.currentWaypointIndex];
                let reached = this.moveTo(target);

                if (reached) {
                    this.currentWaypointIndex++;
                }
            }
        }
        this.updateHealthBar();

        let tile = this.scene.map.getTileAtWorldXY(this.x, this.y, true, this.scene.cameras.main, 'Tile Layer 3');
        if (tile && tile.index !== -1) {  // Check if there is a tile and it is not an empty tile
            this.hide(true);
        } else {
            this.hide(false);
        }
    }
    detectAndShoot(currentTime) {
        const enemies = (this.team === 'red') ? 
                  this.scene.blueTeam.concat(this.scene.blueTeamTurrets) : 
                  this.scene.redTeam.concat(this.scene.redTeamTurrets);
        
        let enemyDetected = false;  // Flag to check if any enemy is detected
    
        for (let enemy of enemies) {
            if (
                enemy.active && 
                Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <= this.attackRange &&
                (enemy.isHidden === false || enemy.isHidden === true && this.isHidden === true)
                ) {
                enemyDetected = true;  // Enemy is detected within range
                if (currentTime > this.lastShotTime + this.shootingCooldown) {
                    this.shootAt(enemy, enemies);  // Perform shooting
                    this.lastShotTime = currentTime;  // Update last shot time
                    //console.log(`Electrovox from ${this.team} shooting at enemy!`);
                }
            }
        }
    
        if (enemyDetected) {
            this.setVelocity(0, 0);  // Stop moving if any enemy is detected
            return true;  // Indicate that action was taken based on enemy detection
        }
        return false;  // No enemy was detected or no action taken
    }
    // shootAt(enemy) {
    //     enemy.takeDamage(20);  // Adjust damage as needed
    // }
    shootAt(enemy, enemies) {
        const direction = new Phaser.Math.Vector2(enemy.x - this.x, enemy.y - this.y).normalize();
        const offsetX = this.x + direction.x * 64;
        const offsetY = this.y + direction.y * 64;
        new Bullet(this.scene, offsetX, offsetY, 'energyBallRed', direction, this.bulletSpeed, this.bulletDamage, enemies, this.bulletLifetime);
    }
    moveTo(target) {
        let dx = target.x - this.x;
        let dy = target.y - this.y;
        let angle = Math.atan2(dy, dx);
        this.setVelocity(Math.cos(angle) * this.moveSpeed, Math.sin(angle) * this.moveSpeed);

        // Check if close enough to the target waypoint to consider it "reached"
        if (Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) < 10) {
            this.setVelocity(0, 0); // Stop moving
            return true; // Target reached
        }
        return false; // Target not yet reached
    }
    takeDamage(amount) { 
        if (!this.active) return;  // Skip if already destroyed
        this.currentHealth -= amount;
        if (this.currentHealth <= 0) {
            this.die();
        }
    }
    updateHealthBar() {
        if (!this.active) return;  // Skip updating the health bar if not active

        this.healthBar.clear();
        this.healthBar.setPosition(this.x - 30, this.y - 40);

        this.healthBar.fillStyle(0x808080, 1);
        this.healthBar.fillRect(0, 0, 60, 10);

        this.healthBar.fillStyle(0xff0000, 1);
        this.healthBar.fillRect(0, 0, 60 * (this.currentHealth / this.maxHealth), 10);
    }
    die() {
        let index = this.scene.electrovoxi.indexOf(this);
        if (index !== -1) {
            this.scene.electrovoxi.splice(index, 1);  // Remove from array
        }
        let teamArray = (this.team === 'red' ? this.scene.redTeam : this.scene.blueTeam);
        let teamIndex = teamArray.indexOf(this);
        if (teamIndex !== -1) {
            teamArray.splice(teamIndex, 1);
        }
        this.healthBar.destroy();
        this.destroy();  // Phaser's method to remove the sprite
    }
    hide(hideStatus) { //TODO: after jam; more intricate hide mechanic for characters in seperate bushes than the enemies
        if (hideStatus) {
            this.isHidden = true;
            this.setAlpha(0.5);  // Set opacity to 50%
        } else {
            this.isHidden = false;
            this.setAlpha(1.0);  // Set opacity to 100%
        }
    }
    
}