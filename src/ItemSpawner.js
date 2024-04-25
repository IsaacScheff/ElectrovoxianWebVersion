export default class ItemSpawner {
    constructor(scene, itemDetails) {
        this.scene = scene;
        this.itemDetails = itemDetails;
        this.spawnRate = 20000;  // Spawn an item every 20 seconds
        this.timer = this.scene.time.addEvent({
            delay: this.spawnRate,
            callback: this.spawnItem,
            callbackScope: this,
            loop: true
        });
    }

    spawnItem() {
        const detail = Phaser.Utils.Array.GetRandom(this.itemDetails);
        const x = Phaser.Math.Between(400, 1648);  
        const y = Phaser.Math.Between(400, 1648);

        new Item(this.scene, x, y, detail.texture, detail.effect);
    }
}
