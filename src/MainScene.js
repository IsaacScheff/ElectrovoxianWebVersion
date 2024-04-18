import Player from "./Player.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        Player.preload(this);
        this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/images/map.json');

    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32);
        const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0);

        this.player = new Player({ scene:this, x:128, y:1920, texture:'electrovox' });
        this.player.scaleX = 2;
        this.player.scaleY = 2;
        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setLerp(0.1, 0.1);
        this.cameras.main.setBounds(0, 0, 2048, 2048);
    }

    update() {
        this.player.update();
    }
}