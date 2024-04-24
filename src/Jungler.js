//import Harvester from "./Harvester.js";
export default class Jungler extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        super(data.scene.matter.world, data.x, data.y, data.texture, data.role, { label: 'jungler' });
        this.scene = data.scene;
        this.role = data.role;
        this.team = data.team;
        this.creepSpawns = data.waypoints; 
        this.currentTarget = null;
        this.moveSpeed = 3;
        this.attackRange = 100;
        this.cooldownPeriod = 1000;
        this.lastFireTime = 0;

        this.maxHealth = 100;
        this.currentHealth = this.maxHealth;
        this.createHealthBar();

        this.setIgnoreGravity(true);
        this.scene.add.existing(this);
    }

    static preload(scene) {
        scene.load.image('gravithor', 'assets/images/Gravithor.png');
    }

    update(time, delta) {
        if (!this.active) return;

        if (!this.currentTarget || !this.isTargetInRange(this.currentTarget)) {
            this.findNewTarget();
        }

        if (this.currentTarget && this.isTargetInRange(this.currentTarget)) {
            if (time > this.lastFireTime + this.cooldownPeriod) {
                this.attack(this.currentTarget);
                this.lastFireTime = time;
            }
        } else {
            this.moveToNextCreepSpawn();
        }

        this.updateHealthBar();
    }

    moveToNextCreepSpawn() {
        if (!this.currentTarget || this.isAtTarget(this.currentTarget)) {
            this.currentTarget = this.selectRandomCreepSpawn();
        }
        this.moveTo(this.currentTarget);
    }

    selectRandomCreepSpawn() {
        return this.creepSpawns[Phaser.Math.Between(0, this.creepSpawns.length - 1)];
    }

    findNewTarget() {
        // Implement logic to find the closest enemy jungler, laner, or a creep
        let enemies = this.findEnemies();
        let closest = null;
        let closestDistance = Infinity;

        enemies.forEach(enemy => {
            let distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
            if (distance < closestDistance) {
                closest = enemy;
                closestDistance = distance;
            }
        });

        this.currentTarget = closest;
    }

    findEnemies() {
        // Return an array of all enemies that are not creeps (junglers and laners)
        return this.team === 'red' ? this.scene.blueHarvesters : this.scene.redHarvesters;
    }

    isAtTarget(target) {
        return Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) < 10;
    }

    isTargetInRange(target) {
        return Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) <= this.attackRange;
    }

    moveTo(target) {
        let angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
        this.setVelocity(Math.cos(angle) * this.moveSpeed, Math.sin(angle) * this.moveSpeed);
    }

    attack(target) {
        console.log(`Jungler attacking ${target}`);
        target.takeDamage(20); // Example damage value
    }

    takeDamage(amount) {
        this.currentHealth -= amount;
        if (this.currentHealth <= 0) {
            this.die();
        }
    }

    die() {
        console.log("Jungler died.");
        //remove from appropriate arrays
        this.destroy();
    }

    createHealthBar() {
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();
    }

    updateHealthBar() {
        this.healthBar.clear();
        this.healthBar.fillStyle(0x00ff00, 1);
        this.healthBar.fillRect(this.x - 25, this.y - 40, 50 * (this.currentHealth / this.maxHealth), 5);
    }
}
