import CollisionCategories from "./CollisionCategories";
export default class Item extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { scene, x, y, texture, effect} = data;
        super(scene.matter.world, x, y, texture);
        this.setCollisionCategory(CollisionCategories.ITEM);
        this.setCollidesWith(CollisionCategories.PLAYER);
        this.scene = scene;
        this.effect = effect;

        this.scene.add.existing(this);

        this.scene.matterCollision.addOnCollideStart({
            // objectA: this,
            // callback: this.handleCollision,
            // context: this
            objectA: this,
            objectB: this.scene.player,
            callback: this.handleCollision,
            context: this

        });
    }

    handleCollision({ bodyA, bodyB, gameObjectB }) {
        if (gameObjectB === this.scene.player) { // Ensure you have a reference to the player in the scene
            this.collect();
        }
    }

    static preload(scene) {
        // Preload your item textures
        scene.load.image('techScrap', 'assets/images/TechScrap.png');
        scene.load.image('healthPack', 'assets/images/HealthPack.png');
        scene.load.image('orangeUniform', 'assets/images/OrangeUniform.png');
        scene.load.image('blueUniform', 'assets/images/BlueUniform.png');
    }

    collect() {
        console.log(`Collected an item with effect: ${this.effect}`);
        // Perform effect based on the type of item
        this.scene.events.emit(this.effect);
        this.destroy();
    }
}
