import Item from "./Item";
export default class ItemSpawner {
    constructor(scene) {
        this.scene = scene;
        this.itemDetails = [
            { texture: 'techScrap', effect: 'collectTech' },
            { texture: 'techScrap', effect: 'collectTech' },
            { texture: 'techScrap', effect: 'collectTech' },
            { texture: 'healthPack', effect: 'heal' },
            { texture: 'orangeUniform', effect: 'joinRedTeam' },
            { texture: 'blueUniform', effect: 'joinBlueTeam' }
        ];
        this.spawnRate = 5000;  // Spawn an item every 5 seconds
        //this.spawnRate = 100;  // turbo testing speeds
        this.scene.time.addEvent({
            delay: this.spawnRate,
            callback: this.spawnItem,
            callbackScope: this,
            loop: true
        });
    }

    spawnItem() {
        let details = Phaser.Utils.Array.GetRandom(this.itemDetails);
        details.x = Phaser.Math.Between(384, 1696);  
        details.y = Phaser.Math.Between(384, 1696);
        details.scene = this.scene;

        new Item(details);
    }
}
