import Bullet from "./Bullet";
import CollisionCategories from "./CollisionCategories";
export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { scene, x, y, texture } = data;
        super(scene.matter.world, x, y, texture);
        this.setCollisionCategory(CollisionCategories.PLAYER);
        this.setCollidesWith(CollisionCategories.ITEM | CollisionCategories.DEFAULT);
        scene.add.existing(this);
        this.team = 'red'; 

        this.setFixedRotation();

        this.shootingDirection = new Phaser.Math.Vector2(1, 0); // Default direction
        this.bulletSpeed = 10;
        this.shootingCooldown = 500;
        this.bulletLifetime = 350;
        this.lastShotTime = 0;
        this.damage = 30;

        this.body.parts.forEach(part => part.gameObject = this);

        this.maxHealth = 100;
        this.currentHealth = this.maxHealth;
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();

        this.isHidden = false;
    }

    static preload(scene) {
        scene.load.image('electrovoxPlayerRed', 'assets/images/ElectrovoxPlayerRed.png');
        scene.load.image('electrovoxPlayerBlue', 'assets/images/ElectrovoxPlayerBlue.png');
        scene.load.audio('playerHurt', 'assets/audio/PlayerHurt.mp3');
    }

    update(time, delta) {
        this.flipX = (this.body.velocity.x < 0);  // Flip sprite based on horizontal movement
        
        const speed = 4;
        //const speed = 25; //for zooming around the map to test
        let playerVelocity = new Phaser.Math.Vector2();
        let direction = new Phaser.Math.Vector2();

        // Movement Controls
        if(this.inputKeys.left.isDown) {
            playerVelocity.x = -1;
        } else if (this.inputKeys.right.isDown) {
            playerVelocity.x = 1;
        }
        if(this.inputKeys.up.isDown) {
            playerVelocity.y = -1;
        } else if (this.inputKeys.down.isDown) {
            playerVelocity.y = 1;
        }

        // Shooting Direction Controls
        if (this.inputKeys.arrowLeft.isDown) {
            direction.x = -1;
        } else if (this.inputKeys.arrowRight.isDown) {
            direction.x = 1;
        }
        if (this.inputKeys.arrowUp.isDown) {
            direction.y = -1;
        } else if (this.inputKeys.arrowDown.isDown) {
            direction.y = 1;
        }

        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);
        this.body.position.x = this.x;
        this.body.position.y = this.y;

        if (direction.length() > 0) {
            this.shootingDirection = direction.normalize();
        }

        if (this.inputKeys.shoot.isDown && time > this.lastShotTime + this.shootingCooldown) {
            this.shoot();
            this.lastShotTime = time;
        }

        this.updateHealthBar();

        let tile = this.scene.map.getTileAtWorldXY(this.x, this.y, true, this.scene.cameras.main, 'Tile Layer 3');
        if (tile && tile.index !== -1) {  // Check if there is a tile and it is not an empty tile
            this.hide(true);
        } else {
            this.hide(false);
        }
    }

    shoot() {
        if (this.shootingDirection.lengthSq() > 0) {
            this.scene.playSoundIfClose('electrovoxShot', this.x, this.y);
            let direction = this.shootingDirection.normalize();
            let enemies = (this.team === 'red' ? this.scene.blueTeam.concat(this.scene.blueTeamTurrets) : this.scene.redTeam.concat(this.scene.redTeamTurrets));
            enemies = enemies.concat(this.scene.creeps);
            new Bullet(this.scene, this.x + direction.x * 30, this.y + direction.y * 30, 'energyBallRed', direction, this.bulletSpeed, this.damage, enemies, this.bulletLifetime);
        }
    }

    updateHealthBar() {
        this.healthBar.clear();
        this.healthBar.setPosition(this.x - 30, this.y - 40);

        this.healthBar.fillStyle(0x808080, 1);
        this.healthBar.fillRect(0, 0, 60, 10);

        this.healthBar.fillStyle(0x00ff00, 1);
        this.healthBar.fillRect(0, 0, 60 * (this.currentHealth / this.maxHealth), 10);
        this.healthBar.setDepth(1000);
    }

    takeDamage(amount) {
        this.scene.playSoundIfClose('playerHurt', this.x, this.y);
        this.currentHealth -= amount;
        if(this.currentHealth > this.maxHealth){
            this.currentHealth = this.maxHealth;
        }
        this.currentHealth = Math.max(0, this.currentHealth);
        this.updateHealthBar();

        if (this.currentHealth <= 0) {
            this.die();
        }
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

    die(){
        this.scene.handlePlayerDeath();
    }
    
    flashRed() {
        this.setTint(0xff0000); // Set tint to red
        this.scene.time.delayedCall(100, () => { // Delay before clearing the tint
            this.clearTint(); // Clear tint to return to normal color
        }, [], this);
    }
}