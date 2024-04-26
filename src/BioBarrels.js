export default class BioBarrels extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { scene, x, y, texture, team } = data;
        super(scene.matter.world, x, y, texture);
        this.scene = scene;
        this.team = team; // Team association, e.g., 'red' or 'blue'

        this.scene.add.existing(this);
        this.maxHealth = 100; 
        this.currentHealth = this.maxHealth;
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();
        this.healthBarColor = (this.team === 'red' ? '0xffa500' : "0x189ab4");

        this.scene.matterCollision.addOnCollideStart({
            objectA: this,
            objectB: this.scene.player,
            callback: this.handleCollision,
            context: this
        });

    }

    handleCollision({ bodyA, bodyB, gameObjectB }) {
        if (gameObjectB === this.scene.player) { // Ensure you have a reference to the player in the scene
            this.collectBioEnergySap();
        }
    }

    collectBioEnergySap() {
        if(this.scene.techScrapCollected < 10) return;

        if(this.team === 'red'){
            this.scene.redBioEnergyCollected = true;
        } else if (this.team === 'blue') {
            this.scene.blueBioEnergyCollected = true;
        }
        this.scene.events.emit("collectTech");
    }

    static preload(scene) {
        scene.load.image('bioBarrels', 'assets/images/BioEnergyBarrels.png'); 
    }

    update(time, delta) {
        this.updateHealthBar();
    }

    takeDamage(amount) {
        this.currentHealth -= amount;
        this.currentHealth = Math.max(0, this.currentHealth);
        if (this.currentHealth <= 0) {
            this.die();
        }
    }

    updateHealthBar() {
        this.healthBar.clear();
        this.healthBar.setPosition(this.x - 36, this.y - 110);
        this.healthBar.fillStyle(0x808080, 1);
        this.healthBar.fillRect(0, 0, 80, 10);
        this.healthBar.fillStyle(this.healthBarColor, 1);
        this.healthBar.fillRect(0, 0, 80 * (this.currentHealth / this.maxHealth), 10);
        this.healthBar.setDepth(1000);
    }

    die() {
        this.healthBar.destroy();
        this.setAlpha(0);
        this.scene.BioBarrelsDestroyed();
    }
    flashRed() {
        this.setTint(0xff0000); // Set tint to red
        this.scene.time.delayedCall(100, () => { // Delay before clearing the tint
            this.clearTint(); // Clear tint to return to normal color
        }, [], this);
    }
}
