export default class Electrovox extends Phaser.Physics.Matter.Sprite {

    constructor(data) {
        let { scene, x, y, texture, team, lane, waypoints } = data;
        super(scene.matter.world, x, y, texture);
        this.team = team;
        this.scene.add.existing(this);
        this.waypoints = waypoints;
        this.currentWaypointIndex = 0;
        this.moveSpeed = 2;

        this.maxHealth = 100;
        this.currentHealth = this.maxHealth;
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();
    }
    static preload(scene) {
        scene.load.image('electrovoxRedTeam', 'assets/images/ElectrovoxRedTeam.png');
        scene.load.image('electrovoxBlueTeam', 'assets/images/ElectrovoxBlueTeam.png');
    }
    update() {
        if (!this.active) return;  // Skip updating if not active

        if (this.waypoints && this.currentWaypointIndex < this.waypoints.length) {
            let target = this.waypoints[this.currentWaypointIndex];
            let reached = this.moveTo(target);

            if (reached) {
                this.currentWaypointIndex++;
            }
        }
        this.updateHealthBar();
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
        console.log("bam!");
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
        console.log("Minion died.");
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
    
}