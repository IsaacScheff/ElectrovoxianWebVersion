import Harvester from "./Harvester";

export default class Laner extends Harvester {
    constructor(data) {
        super(data);
        this.attackRange = 150; 
        this.waypoints = data.waypoints || [];  // Array of waypoints
        this.currentWaypointIndex = 0;
        this.midpointReached = false;
    }

    update(time, delta) {
        super.update(time, delta); 

        if (!this.midpointReached) {
            this.moveToWaypoint();
        } else {
            this.engagementBehavior(time);
        }
    }
    engagementBehavior(time) {
        if (!this.currentTarget || !this.currentTarget.active) {
            this.findTarget(); // Find new targets if the current one is inactive or not set
        }

        if (this.currentTarget && this.canAttack(time)) {
            this.attack(this.currentTarget);
        } else {
            // Optional: Logic for moving towards engagement or holding position
            this.holdPosition();
        }
    }
    moveToWaypoint() {
        if (this.currentWaypointIndex < this.waypoints.length) {
            let waypoint = this.waypoints[this.currentWaypointIndex];
            if (Phaser.Math.Distance.Between(this.x, this.y, waypoint.x, waypoint.y) <= 10) {
                this.currentWaypointIndex++;  // Move to next waypoint
                if (this.currentWaypointIndex === this.waypoints.length / 2) {
                    this.midpointReached = true;  // Check if the midpoint is reached
                }
            } else {
                this.moveTo(waypoint.x, waypoint.y);
            }
        }
    }
    findTarget() {
        // Example: Find nearest enemy or turret under attack
        // Logic to prioritize targets could be added here
        this.currentTarget = this.findClosestEnemy() || this.findNearestTurretUnderAttack();
    }

    canAttack(time) {
        return Phaser.Math.Distance.Between(this.x, this.y, this.currentTarget.x, this.currentTarget.y) <= this.attackRange &&
               time > this.lastAttackTime + this.attackCooldown;
    }

    attack(target) {
        // Attack logic, potentially shooting projectiles or similar
        console.log(`Attacking ${target}`);
        this.lastAttackTime = Date.now();
        // Damage logic would be implemented here, assuming target has takeDamage method
        target.takeDamage(10);
    }

    findClosestEnemy() {
        // Simplified logic to find the closest enemy
        let enemies = this.scene.electrovoxi.filter(e => e.team !== this.team);
        let closest = null;
        let closestDist = Infinity;
        enemies.forEach(enemy => {
            let dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
            if (dist < closestDist) {
                closestDist = dist;
                closest = enemy;
            }
        });
        return closest;
    }

    findNearestTurretUnderAttack() {
        // Example placeholder function
        return null; // Implement actual logic to find turrets under attack by allies
    }
}
