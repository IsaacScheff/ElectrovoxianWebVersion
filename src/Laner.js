export default class Laner extends Phaser.Physics.Matter.Sprite {

    constructor(data) {
        let { scene, x, y, texture, team, waypoints } = data;
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

        this.isHidden = false;
    }

    static preload(scene) {
        scene.load.image('quantumSentinel', 'assets/images/QuantumSentinel.png');
    }

    update(time, delta) {
        if (!this.active) return;  // Skip updating if not active

        if (!this.detectAndShoot(time)) {
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
        if (tile && tile.index !== -1) {
            this.hide(true);
        } else {
            this.hide(false);
        }
    }

    detectAndShoot(currentTime) {
        const enemies = (this.team === 'red') ? 
                  this.scene.blueTeam.concat(this.scene.blueTeamTurrets) : 
                  this.scene.redTeam.concat(this.scene.redTeamTurrets);
        
        let enemyDetected = false;
        for (let enemy of enemies) {
            if (
                enemy.active && 
                Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <= this.attackRange &&
                (enemy.isHidden === false || (enemy.isHidden === true && this.isHidden === true))
                ) {
                enemyDetected = true;
                if (currentTime > this.lastShotTime + this.shootingCooldown) {
                    this.shootAt(enemy);
                    this.lastShotTime = currentTime;
                }
            }
        }

        if (enemyDetected) {
            this.setVelocity(0, 0);
            return true;
        }
        return false;
    }

    shootAt(enemy) {
        enemy.takeDamage(20);
    }

    moveTo(target) {
        let dx = target.x - this.x;
        let dy = target.y - this.y;
        let angle = Math.atan2(dy, dx);
        this.setVelocity(Math.cos(angle) * this.moveSpeed, Math.sin(angle) * this.moveSpeed);

        if (Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) < 10) {
            this.setVelocity(0, 0);
            return true;
        }
        return false;
    }

    takeDamage(amount) {
        this.currentHealth -= amount;
        if (this.currentHealth <= 0) {
            this.die();
        }
    }

    updateHealthBar() {
        if (!this.active) return;

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
        this.destroy();
    }

    hide(hideStatus) {
        if (hideStatus) {
            this.isHidden = true;
            this.setAlpha(0.5);
        } else {
            this.isHidden = false;
            this.setAlpha(1.0);
        }
    }
}



// import Harvester from "./Harvester";

// export default class Laner extends Harvester {

//     constructor(data) {
//         super(data);
//         this.waypoints = data.waypoints;
//         this.currentWaypointIndex = 0;
//         this.shootingCooldown = 1500; // Cooldown in milliseconds from Electrovox
//         this.lastShotTime = 0; 
//     }

//     update(time, delta) {
//         super.update(time, delta); // Call Harvester update for health bar and hiding logic

//         if (!this.detectAndShoot(time)) {
//             if (this.waypoints && this.currentWaypointIndex < this.waypoints.length) {
//                 let target = this.waypoints[this.currentWaypointIndex];
//                 let reached = this.moveTo(target);

//                 if (reached) {
//                     this.currentWaypointIndex++;
//                 }
//             }
//         }
//     }
//     detectAndShoot(currentTime) {
//         const enemies = (this.team === 'red') ? 
//                       this.scene.blueTeam.concat(this.scene.blueTeamTurrets) : 
//                       this.scene.redTeam.concat(this.scene.redTeamTurrets);
        
//         let enemyDetected = false;  // Flag to check if any enemy is detected
        
//         console.log(`Checking enemies for ${this.team}, Enemies count: ${enemies.length}`);
//         for (let enemy of enemies) {
//             if (
//                 enemy.active && 
//                 Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <= this.attackRange &&
//                 (enemy.isHidden === false || (enemy.isHidden === true && this.isHidden === true))
//                 ) {
//                 console.log(`Enemy detected at range: ${Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y)}`);
//                 enemyDetected = true;  // Enemy is detected within range
//                 if (currentTime > this.lastShotTime + this.shootingCooldown) {
//                     console.log(`Shooting at enemy from ${this.team}`);
//                     this.shootAt(enemy);  // Perform shooting
//                     this.lastShotTime = currentTime;  // Update last shot time
//                 }
//             }
//         }
    
//         if (enemyDetected) {
//             this.setVelocity(0, 0);  // Stop moving if any enemy is detected
//             return true;  // Indicate that action was taken based on enemy detection
//         }
//         return false;  // No enemy was detected or no action taken
//     }

//     // detectAndShoot(currentTime) {
//     //     const enemies = (this.team === 'red') ? 
//     //                     this.scene.blueTeam.concat(this.scene.blueTeamTurrets) : 
//     //                     this.scene.redTeam.concat(this.scene.redTeamTurrets);
        
//     //     let enemyDetected = false;

//     //     for (let enemy of enemies) {
//     //         if (
//     //             enemy.active && 
//     //             Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <= this.attackRange &&
//     //             (enemy.isHidden === false || enemy.isHidden === true && this.isHidden === true)
//     //             ) {
//     //             enemyDetected = true;
//     //             if (currentTime > this.lastShotTime + this.shootingCooldown) {
//     //                 this.shootAt(enemy);
//     //                 this.lastShotTime = currentTime;
//     //             }
//     //         }
//     //     }

//     //     if (enemyDetected) {
//     //         this.setVelocity(0, 0);
//     //         return true;
//     //     }
//     //     return false;
//     // }

//     shootAt(enemy) {
//         console.log(`Laner from ${this.team} shooting at enemy!`);
//         enemy.takeDamage(20);
//     }

//     moveTo(target) {
//         let dx = target.x - this.x;
//         let dy = target.y - this.y;
//         let angle = Math.atan2(dy, dx);
//         this.setVelocity(Math.cos(angle) * this.moveSpeed, Math.sin(angle) * this.moveSpeed);

//         if (Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) < 10) {
//             this.setVelocity(0, 0);
//             return true;
//         }
//         return false;
//     }
// }
