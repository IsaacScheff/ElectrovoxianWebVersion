export default class BioBarrels extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { scene, x, y, texture, team } = data;
        super(scene.matter.world, x, y, texture);
        this.scene = scene;
        this.team = team; // Team association, e.g., 'red' or 'blue'

        this.scene.add.existing(this);
        this.maxHealth = 5000; 
        this.currentHealth = this.maxHealth;
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();

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
        this.healthBar.setPosition(this.x - 40, this.y - 60);
        this.healthBar.fillStyle(0x808080, 1);
        this.healthBar.fillRect(0, 0, 80, 10);
        this.healthBar.fillStyle(0xff0000, 1);
        this.healthBar.fillRect(0, 0, 80 * (this.currentHealth / this.maxHealth), 10);
    }

    die() {
        console.log(`${this.team} BioBarrels destroyed. Game ends here`);
        this.healthBar.destroy();
        this.destroy();
    }
}
