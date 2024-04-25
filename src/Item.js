export default class Item extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, effect) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.effect = effect; 

        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        this.setInteractive();
        this.on('pointerdown', () => {
            this.collect();
        });
    }

    collect() {
        console.log(`Collected an item with effect: ${this.effect}`);
        this.scene.events.emit('itemCollected', this.effect);
        this.destroy();
    }
}
