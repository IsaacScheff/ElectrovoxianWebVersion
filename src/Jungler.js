import Harvester from "./Harvester";

export default class Jungler extends Harvester {
    constructor(data) {
        super(data);
        this.patrolPoints = []; // Points in the jungle to patrol
        this.currentPatrolIndex = 0;
        this.attackRange = 100; // Example range
    }

    // update(time, delta) {
    //     super.update(time, delta); // Call base update for health bar and hiding

    //     if (!this.currentTarget || !this.currentTarget.active) {
    //         this.findTarget(); // Find new targets if the current one is inactive or not set
    //     }

    //     if (this.currentTarget && this.canAttack(time)) {
    //         this.attack(this.currentTarget);
    //     } else {
    //         this.patrol(); // Move between patrol points if not currently engaging a target
    //     }
    // }

    // findTarget() {
    //     // Logic to find the closest jungle creep or player
    //     this.currentTarget = this.findClosestCreep() || this.findPlayer();
    // }

    // patrol() {
    //     // Move to next patrol point if reached current one
    //     if (Phaser.Math.Distance.Between(this.x, this.y, this.patrolPoints[this.currentPatrolIndex].x, this.patrolPoints[this.currentPatrolIndex].y) < 5) {
    //         this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
    //     }
    //     let nextPoint = this.patrolPoints[this.currentPatrolIndex];
    //     this.moveTo(nextPoint.x, nextPoint.y);
    // }

    // findClosestCreep() {
    //     // Simplified logic to find the closest jungle creep
    //     let creeps = this.scene.creeps.filter(c => c.active); // Assuming creeps are active and have a position
    //     let closest = null;
    //     let closestDist = Infinity;
    //     creeps.forEach(creep => {
    //         let dist = Phaser.Math.Distance.Between(this.x, this.y, creep.x, creep.y);
    //         if (dist < closestDist) {
    //             closestDist = dist;
    //             closest = creep;
    //         }
    //     });
    //     return closest;
    // }

    // findPlayer() {
    //     // Assuming a player exists in the scene
    //     return this.scene.player;
    // }
}
