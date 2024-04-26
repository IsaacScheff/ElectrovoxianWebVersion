import CollisionCategories from "./CollisionCategories";

export default class Jungler extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { scene, x, y, texture, team, waypoints, role } = data;
        super(scene.matter.world, x, y, texture);
        this.team = team;
        this.scene.add.existing(this);
        this.waypoints = waypoints;
        this.currentWaypointIndex = 0;
        this.moveSpeed = 2;
        this.role = role;
        this.collisionFilter = {
                        category: CollisionCategories.NPC,
                        mask: CollisionCategories.DEFAULT
                    }

        this.maxHealth = 400;
        this.currentHealth = this.maxHealth;
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();
        this.healthBarColor = (this.team === 'red' ? 0xffa500 : 0x189ab4);

        this.senseRange = 220;
        this.attackRange = 96;
        this.attackDamage = 40;
        this.attackingCooldown = 500;
        this.lastAttackTime = 0;

        this.isHidden = false;
        this.chasingTarget = false;
    }

    static preload(scene) {
        scene.load.image('gravithor', 'assets/images/Gravithor.png');
        scene.load.audio('gravithorAttack', 'assets/audio/GravithorAttack.mp3');
        scene.load.audio('gravithorHurt', 'assets/audio/GravithorHurt.mp3');
    }

    update(time, delta) {
        if (!this.active) return;  // Skip updating if not active

        this.flipX = (this.body.velocity.x > 0);  // Flip sprite based on horizontal movement

        if (!this.detectAndAttack(time)) {
            if (this.waypoints && this.waypoints.length > 0) {
                let target = this.waypoints[this.currentWaypointIndex];
                let reached = this.moveTo(target.x, target.y);

                if (reached) {
                    this.currentWaypointIndex = Math.floor(Math.random() * this.waypoints.length); // Select a random waypoint index
                }
            }
        }
   
        this.updateHealthBar();

        let tile = this.scene.map.getTileAtWorldXY(this.x, this.y, true, this.scene.cameras.main, 'Tile Layer 3');
        if (tile && tile.index !== -1) {
            this.hide(true);
        } else {
            this.hide(false);
        }
    }

    detectAndAttack(currentTime) {
        let enemies = (this.team === 'red') ? this.scene.blueTeam.concat(this.scene.blueTeamTurrets) : this.scene.redTeam.concat(this.scene.redTeamTurrets);
        enemies = enemies.concat(this.scene.creeps);
        let enemyDetected = false;
        for (let enemy of enemies) {
            if (enemy.active && Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <= this.senseRange) {
                enemyDetected = true;
                if (Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <= this.attackRange && currentTime > this.lastAttackTime + this.attackingCooldown) {
                    this.attack(enemy);
                    this.lastAttackTime = currentTime;
                } else {
                    this.moveTo(enemy.x, enemy.y);
                }
                break;  // Stop at the first enemy detected within range
            }
        }
        if (!enemyDetected && this.chasingTarget) {
            this.moveTo(this.spawnX, this.spawnY); 
            this.chasingTarget = false;
        }

        return enemyDetected;
    }

    attack(enemy) {
        //this.scene.playSoundIfClose('gravithorAttack', this.x, this.y); //this was kinda obnxious tbh
        enemy.flashRed();
        enemy.takeDamage(this.attackDamage);
    }

    moveTo(targetX, targetY) {
        let dx = targetX - this.x;
        let dy = targetY - this.y;
        let distance = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);
        if (distance < 10) {
            this.setVelocity(0, 0); // Stop moving if close enough
            return true;
        } else {
            let angle = Math.atan2(dy, dx);
            this.setVelocity(Math.cos(angle) * this.moveSpeed, Math.sin(angle) * this.moveSpeed);
            return false;
        }
    }

    takeDamage(amount) {
        this.scene.playSoundIfClose('gravithorHurt', this.x, this.y);
        this.currentHealth -= amount;
        if (this.currentHealth <= 0) {
            this.die();
        }
        this.updateHealthBar();
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

    die() {
        let index = this.scene.electrovoxi.indexOf(this);
        if (index !== -1) {
            this.scene.electrovoxi.splice(index, 1);
        }
        let harvesterArray = (this.team === 'red' ? this.scene.redHarvesters : this.scene.blueHarvesters);
        let harvesterIndex = harvesterArray.indexOf(this);
        if (harvesterIndex !== -1) {
            harvesterArray.splice(harvesterIndex, 1);
        }
        let teamArray = (this.team === 'red' ? this.scene.redTeam : this.scene.blueTeam);
        let teamIndex = teamArray.indexOf(this);
        if (teamIndex !== -1) {
            teamArray.splice(teamIndex, 1);
        }
        this.healthBar.destroy();
        this.scene.harvesterSpawner.handleHarvesterDeath(this);
        this.destroy();
    }

    hide(hideStatus) {
        this.isHidden = hideStatus;
        this.setAlpha(hideStatus ? 0.5 : 1.0);
    }
    flashRed() {
        this.setTint(0xff0000); // Set tint to red
        this.scene.time.delayedCall(100, () => { // Delay before clearing the tint
            this.clearTint(); // Clear tint to return to normal color
        }, [], this);
    }
}


