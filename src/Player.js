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
}