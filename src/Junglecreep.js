export default class JungleCreep extends Phaser.Physics.Matter.Sprite {

    constructor(data) {
        let { scene, x, y, texture,} = data;
        super(scene.matter.world, x, y, texture);

        this.scene.add.existing(this);
        this.moveSpeed = 2;

        this.maxHealth = 100;
        this.currentHealth = this.maxHealth;
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();

        this.isHidden = false;

        this.spawnX = x;
        this.spawnY = y; 
        this.leashRange = 100; // Range to return to spawn point

        this.senseRange = 160; //can sense and move towards target
        this.attackRange = 85; // melee attacker so needs to be close
        this.attackCooldown = 1000; // Cooldown in milliseconds
        this.lastAttackTime = 0; 

        this.chasingTarget = false; 
    }
    static preload(scene) {
        scene.load.image('thermalBeetle', 'assets/images/ThermalBeetle.png');
    }
    update(time, delta) {
        if (!this.active) return;  // Skip updating if not active
        this.updateHealthBar();

        // Check for nearby targets
        let target = this.findClosestTarget();

        let tile = this.scene.map.getTileAtWorldXY(this.x, this.y, true, this.scene.cameras.main, 'Tile Layer 3');
        if (tile && tile.index !== -1) {  // Check if there is a tile and it is not an empty tile
            this.hide(true);
        } else {
            this.hide(false);
        }

        // Target detection and handling
        if (!this.chasingTarget && Phaser.Math.Distance.Between(this.x, this.y, this.spawnX, this.spawnY) > 10) {
            this.moveTo(this.spawnX, this.spawnY); // Move back to spawn if not at spawn and not chasing
        } else {
            let target = this.findClosestTarget();
            if (target && Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) <= this.senseRange) {
                if (Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) > this.attackRange) {
                    this.moveTo(target.x, target.y); // Move towards the target
                } else {
                    this.attack(target, time); // Attack if in range
                }
            } else if (this.chasingTarget) {
                this.moveTo(this.spawnX, this.spawnY); // Return to spawn point
            }
        }
    }
    findClosestTarget() {
        // Example to find the closest player or NPC Harvester - adjust according to your game logic
        let targets = this.scene.redHarvesters.concat(this.scene.blueHarvesters); 
        targets.push(this.scene.player);
        let closest = null;
        let closestDistance = Infinity;
        targets.forEach(target => {
            let distance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
            if (distance < closestDistance) {
                closestDistance = distance;
                closest = target;
            }
        });
        return closest;
    }
    moveTo(targetX, targetY) {
        let dx = targetX - this.x;
        let dy = targetY - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (targetX === this.spawnX && targetY === this.spawnY && distance < 5) {
            this.setVelocity(0, 0); // Stop at spawn point
            this.chasingTarget = false; // No longer chasing the target
        } else {
            let angle = Math.atan2(dy, dx);
            this.setVelocity(Math.cos(angle) * this.moveSpeed, Math.sin(angle) * this.moveSpeed);
            this.chasingTarget = true; // Creep is moving towards a target
        }
    }
    attack(target, time) {
        if (time > this.lastAttackTime + this.attackCooldown) {
            target.takeDamage(20); // Implement takeDamage on the target class
            this.lastAttackTime = time;
        }
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
        console.log("Creep died");
        let index = this.scene.creeps.indexOf(this);
        if (index !== -1) {
            this.scene.creeps.splice(index, 1);  // Remove from array
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