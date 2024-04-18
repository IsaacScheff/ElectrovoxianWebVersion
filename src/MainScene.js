import Electrovox from "./Electrovox.js";
import ElectrovoxSpawner from "./ElectrovoxSpawner.js";
import Player from "./Player.js";
import Turret from "./Turret.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        Player.preload(this);
        Turret.preload(this);
        Electrovox.preload(this);
        this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/images/map.json');

    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        this.map = map;
        const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32);
        const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0);
        const layer2 = map.createLayer('Tile Layer 2', tileset, 0, 0);

        this.player = new Player({ scene:this, x:128, y:1920, texture:'electrovoxPlayerRed' });
        this.player.scaleX = 2;
        this.player.scaleY = 2;
        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        this.redTeamTurrets = [];
        this.blueTeamTurrets = [];
        const redTeamTurretPositions = [ 
            { x: 128, y: 1504 },
            { x: 128, y: 964 },
            { x: 128, y: 464 },
            { x: 544, y: 1920 },
            { x: 1084, y: 1920 },
            { x: 1584, y: 1920 },
            { x: 448, y: 1536 },
            { x: 648, y: 1336 },
            { x: 848, y: 1136 }
        ];
        const blueTeamTurretPositions = [ 
            { x: 1920, y: 544 },
            { x: 1920, y: 1084 },
            { x: 1920, y: 1584 },
            { x: 1504, y: 128 },
            { x: 964, y: 128 },
            { x: 464, y: 128 },
            { x: 1564, y: 432 },
            { x: 1364, y: 632 },
            { x: 1164, y: 832 }
        ];
        redTeamTurretPositions.forEach(position => {
            let turret = new Turret({ scene: this, x: position.x, y: position.y, texture: 'turret', team: 'red' });
            turret.setStatic(true);
            turret.scaleX = 2;
            turret.scaleY = 2;
            this.add.existing(turret);  
            this.redTeamTurrets.push(turret);  
        });
        blueTeamTurretPositions.forEach(position => {
            let turret = new Turret({ scene: this, x: position.x, y: position.y, texture: 'turret', team: 'blue' });
            turret.setStatic(true);
            turret.scaleX = 2;
            turret.scaleY = 2;
            this.add.existing(turret);  
            this.blueTeamTurrets.push(turret);  
        });

        this.electrovoxSpawner = new ElectrovoxSpawner(this);
        this.electrovoxSpawner.spawnMinions();

        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setLerp(0.1, 0.1);
        this.cameras.main.setBounds(0, 0, 2048, 2048);

    }

    update() {
        this.player.update();
    }
}