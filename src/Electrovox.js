export default class Electrovox extends Phaser.Physics.Matter.Sprite {

    constructor(data) {
        let { scene, x, y, texture, team, lane, waypoints } = data;
        super(scene.matter.world, x, y, texture);
        this.scene.add.existing(this);
        this.waypoints = waypoints;
        this.currentWaypointIndex = 0;
        this.moveSpeed = 2;
        this.health = 100;
    }
    static preload(scene) {
        scene.load.image('electrovoxRedTeam', 'assets/images/ElectrovoxRedTeam.png');
        scene.load.image('electrovoxBlueTeam', 'assets/images/ElectrovoxBlueTeam.png');
    }
    update() {
        if (this.waypoints && this.currentWaypointIndex < this.waypoints.length) {
            let target = this.waypoints[this.currentWaypointIndex];
            let reached = this.moveTo(target);

            if (reached) {
                this.currentWaypointIndex++;
            }
        }
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
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }
    
    die() {
        console.log("Minion died.");
        let index = this.scene.electrovoxes.indexOf(this);
        if (index !== -1) {
            this.scene.electrovoxi.splice(index, 1);  // Remove from array
        }
        this.destroy();  // Phaser's method to remove the sprite
    }
    
}