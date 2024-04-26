import Bullet from "./Bullet";

export default class Turret extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { scene, x, y, texture, team } = data;
        super(scene.matter.world, x, y, texture);
        this.scene.add.existing(this);
        this.team = team;
        this.enemies = [];

        this.maxHealth = 150; 
        this.currentHealth = this.maxHealth;
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();
        this.healthBarColor = (this.team === 'red' ? '0xffa500' : "0x189ab4");

        this.detectionArea = new Phaser.Geom.Circle(x, y, 200);

        this.setFixedRotation();

        this.lastFireTime = 0;
        this.cooldownPeriod = 3000; // cooldown in milliseconds
        this.lastDetectionTime = 0; // timestamp of last detection
        this.bulletSpeed = 5;
        this.bulletDamage = 70; 
        this.bulletLifetime = 500;

        this.isHidden = false; //needed for enemies to shoot them

    }

    update(time, delta) {
        this.enemies = (this.team === 'red') ? this.scene.blueTeam : this.scene.redTeam;
        // Check if cooldown has elapsed
        if (time > this.lastFireTime + this.cooldownPeriod) {
            this.enemies.forEach(enemy => { 
                if (enemy.active && Phaser.Geom.Circle.ContainsPoint(this.detectionArea, enemy)) {
                    if (enemy.team !== this.team) {
                        this.fire(enemy);
                        this.lastFireTime = time;
                        return; // Exit after the first target is engaged
                    }
                }
            });
        }
        this.updateHealthBar();
    }
    fire(target) {
        this.scene.playSoundIfClose('turretShot', this.x, this.y);
        const direction = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y).normalize();
        let enemies = this.team === 'red' ? this.scene.blueTeam : this.scene.redTeam; // Enemies list for bullet interaction

        const offsetX = this.x + direction.x * 64;
        const offsetY = this.y + direction.y * 64;
        new Bullet(this.scene, offsetX, offsetY, 'energyBallRed', direction, this.bulletSpeed, this.bulletDamage, enemies, this.bulletLifetime);
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

        this.healthBar.fillStyle(this.healthBarColor, 1);
        this.healthBar.fillRect(0, 0, 60 * (this.currentHealth / this.maxHealth), 10);
    }
    
    static preload(scene) {
        scene.load.image('turret', 'assets/images/FFTurret.png');
        scene.load.audio('turretDestroyed', 'assets/audio/TurretDestroyed.mp3');
        scene.load.audio('turretShot', 'assets/audio/TurretShot.mp3');
    }

    destroy() {
        super.destroy();
    }
    die() {
        console.log("Turret destroyed.");
        let teamArray = (this.team === 'red' ? this.scene.redTeamTurrets : this.scene.blueTeamTurrets);
        let teamIndex = teamArray.indexOf(this);
        if (teamIndex !== -1) {
            teamArray.splice(teamIndex, 1);
        }
        this.healthBar.destroy();
        this.scene.playSoundIfClose('turretDestroyed', this.x, this.y);
        this.destroy();  // Phaser's method to remove the sprite
    }
    flashRed() {
        this.setTint(0xff0000); // Set tint to red
        this.scene.time.delayedCall(100, () => { // Delay before clearing the tint
            this.clearTint(); // Clear tint to return to normal color
        }, [], this);
    }
}




