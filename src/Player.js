export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { scene, x, y, texture } = data;
        super(scene.matter.world, x, y, texture);
        this.scene.add.existing(this);
        this.team = 'red'; //maybe later allow for blue team player

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        var playerCollider = Bodies.circle(this.x, this.y, 20, { isSensor: false, label: 'playerCollider' });
        var playerSensor = Bodies.circle(this.x, this.y, 32, { isSensor: true, label: 'playerSensor' });
        const compoundBody = Body.create({
            parts: [ playerCollider, playerSensor ],
            frictionAir: 0.35,
        });
        this.setExistingBody(compoundBody);
        this.setFixedRotation();

        this.body.parts.forEach(part => part.gameObject = this);

        this.maxHealth = 100;
        this.currentHealth = this.maxHealth;
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();

        this.isHidden = false;
    }

    static preload(scene) {
        scene.load.image('electrovoxPlayerRed', 'assets/images/ElectrovoxPlayerRed.png');
    }

    update() {
        //const speed = 2.5;
        const speed = 25; //for zooming around the map to test
        let playerVelocity = new Phaser.Math.Vector2();
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
        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);
        this.body.position.x = this.x;
        this.body.position.y = this.y;

        this.updateHealthBar();

        let tile = this.scene.map.getTileAtWorldXY(this.x, this.y, true, this.scene.cameras.main, 'Tile Layer 3');
        if (tile && tile.index !== -1) {  // Check if there is a tile and it is not an empty tile
            this.hide(true);
        } else {
            this.hide(false);
        }
    }

    updateHealthBar() {
        this.healthBar.clear();
        this.healthBar.setPosition(this.x - 30, this.y - 40);

        this.healthBar.fillStyle(0x808080, 1);
        this.healthBar.fillRect(0, 0, 60, 10);

        this.healthBar.fillStyle(0xff0000, 1);
        this.healthBar.fillRect(0, 0, 60 * (this.currentHealth / this.maxHealth), 10);
    }

    takeDamage(amount) {
        this.currentHealth -= amount;
        this.currentHealth = Math.max(0, this.currentHealth);
        this.updateHealthBar();

        // if (this.currentHealth <= 0) {
        //     this.die();
        // }
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