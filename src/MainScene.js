import BioBarrels from "./BioBarrels.js";
import Bullet from "./Bullet.js";
import Electrovox from "./Electrovox.js";
import ElectrovoxSpawner from "./ElectrovoxSpawner.js";
import Player from "./Player.js";
import Turret from "./Turret.js";
import JungleCreep from "./JungleCreep.js";
import Jungler from "./Jungler.js";
import CreepSpawner from "./CreepSpawner.js";
import Laner from "./Laner.js";
import HarvesterSpawner from "./HarvesterSpawner.js";
import Item from "./Item.js";
import ItemSpawner from "./ItemSpawner.js";
export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
        this.gamePaused = false;
        this.techScrapCollected = 0;
        this.redBioEnergyCollected = false;
        this.blueBioEnergyCollected = false;
    }

    preload() {
        BioBarrels.preload(this);
        Bullet.preload(this);
        Player.preload(this);
        Turret.preload(this);
        Electrovox.preload(this);
        JungleCreep.preload(this);
        Jungler.preload(this);
        Laner.preload(this);
        Item.preload(this);
        this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/images/map.json');
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        this.map = map;
        const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32);
        const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0);
        const layer2 = map.createLayer('Tile Layer 2', tileset, 0, 0);
        const bushes = map.createLayer('Tile Layer 3', tileset, 0, 0);
        const mapWidth = 2048
        const mapHeight = 2048; 
        this.matter.world.setBounds(0, 0, mapWidth, mapHeight);

        this.input.keyboard.on('keydown-P', () => {
            this.pauseGame();
        });

        this.redTeam = [];
        this.blueTeam = [];

        this.player = new Player({ scene:this, x:128, y:1920, texture:'electrovoxPlayerRed' });
        this.redTeam.push(this.player);
        this.player.scaleX = 2;
        this.player.scaleY = 2;
        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            shoot: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        this.redTeamBarrels = new BioBarrels({ scene: this, x: 192, y: 1792, texture:'bioBarrels', team: 'red'});
        this.redTeamBarrels.scaleX = 2;
        this.redTeamBarrels.scaleY = 2;
        this.redTeamBarrels.setStatic(true);
        this.redTeam.push(this.redTeamBarrels);
        this.blueTeamBarrels = new BioBarrels({ scene: this, x: 1792, y: 192, texture:'bioBarrels', team: 'blue'});
        this.blueTeamBarrels.scaleX = 2;
        this.blueTeamBarrels.scaleY = 2;
        this.blueTeamBarrels.setStatic(true);
        this.blueTeam.push(this.blueTeamBarrels);

        this.redTeamTurrets = [];
        this.blueTeamTurrets = [];
        const redTeamTurretPositions = [ 
            { x: 128, y: 1504 },
            { x: 128, y: 964 },
            { x: 128, y: 464 },
            { x: 544, y: 1900 },
            { x: 1084, y: 1900 },
            { x: 1584, y: 1900 },
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

        this.redHarvesters = [];
        this.blueHarvesters = [];
        this.harvesterSpawner = new HarvesterSpawner(this);
        this.harvesterSpawner.spawnBoth();

        this.electrovoxi = [];
        this.electrovoxSpawner = new ElectrovoxSpawner(this);
        this.electrovoxSpawner.spawnBoth();

        this.creeps = [];
        this.creepSpawner = new CreepSpawner(this);
        this.creepSpawner.spawnCreeps();

        this.itemSpawner = new ItemSpawner(this);
        
        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setLerp(0.1, 0.1);
        this.cameras.main.setBounds(0, 0, 2048, 2048);

        this.events.on("heal", this.healPlayer, this);
        this.events.on("collectTech", this.collectTech, this);
        this.events.on("joinRedTeam", this.joinRedTeam, this);
        this.events.on("joinBlueTeam", this.joinBlueTeam, this);

        this.techScrapText = this.add.text(this.cameras.main.width - 10, 10, `Tech Scrap Collected: ${this.techScrapCollected}`, { 
            font: '18px Arial', 
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 0
            }
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);    
    }

    update(time, delta) {
        if(this.gamePaused) {
            return;
        }
        this.player.update(time, delta);
        this.redTeamBarrels.update(time, delta);
        this.blueTeamBarrels.update(time, delta);
        this.redHarvesters.forEach(harvester => {
            if(harvester.active) { // Check if the npc is still active
                harvester.update(time, delta); // Call the update method of each npc
            }
        });
        this.blueHarvesters.forEach(harvester => {
            if(harvester.active) {
                harvester.update(time, delta);
            }
        });
        this.electrovoxi.forEach(electrovox => {
            if (electrovox.active) {  
                electrovox.update(time, delta);  
            }
        });
        this.creeps.forEach(creep => {
            if (creep.active) { 
                creep.update(time, delta);  
            }
        });
        this.redTeamTurrets.forEach(turret => {
            turret.update(time, delta);
        });
        this.blueTeamTurrets.forEach(turret => {
            turret.update(time, delta);
        });
    }
    pauseGame(message = 'Game Paused') {
        this.gamePaused = !this.gamePaused;  // Toggle the pause state
        if (this.gamePaused) {
            this.matter.world.pause(); // Pause the game's physics
            this.time.timeScale = 0; 
            if (message.includes('GAME OVER')) {
                this.setupGameOver();
            }
            this.showPauseMenu(message);
        } else {
            this.matter.world.resume();
            this.time.timeScale = 1;
            this.hidePauseMenu();
        }
        if (message === 'GAME OVER') {
            this.setupGameOver();
        }
    }
    showPauseMenu(text) {
        this.pauseMenuText = this.add.text(this.cameras.main.scrollX + this.cameras.main.width / 2,
                                       this.cameras.main.scrollY + this.cameras.main.height / 2, 
                                       text, { 
                                           font: '24px Arial', 
                                           fill: '#ffffff',
                                           stroke: '#000000',
                                           strokeThickness: 3,
                                           shadow: {
                                               offsetX: 2,
                                               offsetY: 2,
                                               color: '#000000',
                                               blur: 0
                                           }
                                       })
            .setOrigin(0.5)
            .setDepth(1000);
    }
    hidePauseMenu() {
        if (this.pauseMenuText) {
            this.pauseMenuText.destroy();
        }
    } 
    setupGameOver() {
        this.add.text(this.cameras.main.scrollX + this.cameras.main.width / 2,
                      this.cameras.main.scrollY + this.cameras.main.height / 2 + 40, 
                      'Press any key to return to Menu', { 
                          font: '20px Arial', 
                          fill: '#fff',
                          stroke: '#000',
                          strokeThickness: 3
                      })
            .setOrigin(0.5)
            .setDepth(1000);
    
        this.input.keyboard.once('keydown', () => {
            this.scene.start('MainMenuScene'); 
        });
    } 
    handlePlayerDeath() {
        this.pauseGame("GAME OVER\nPlayer defeated");
    }  
    healPlayer() {
        this.player.takeDamage(-20);
    }
    collectTech() {
        this.techScrapCollected++;
        if(this.techScrapCollected < 10) {
            this.techScrapText.setText(`Tech Scrap Collected: ${this.techScrapCollected}`);
        } else if (!this.blueBioEnergyCollected || !this.redBioEnergyCollected){
            this.techScrapText.setText(
                `Device Ready\n${this.redBioEnergyCollected ? "Red Team Sap Collected" : "Collect Sap from Red Team"}\n${this.blueBioEnergyCollected ? "Blue Team Sap Collected" : "Collect Sap from Blue Team"}`
            );
        } else {
            this.techScrapText.setText("End the conflict\nDestroy either set of barrels");
        }
    }
    joinRedTeam() {
        if(this.player.team === 'red') return;

        this.player.team = 'red';

        const index = this.blueTeam.indexOf(this.player);
        if (index !== -1) {
            this.blueTeam.splice(index, 1);
        }

        this.redTeam.push(this.player);
        this.player.setTexture('electrovoxPlayerRed');
    }
    joinBlueTeam(){
        if(this.player.team === 'blue') return;

        this.player.team = 'blue';

        const index = this.redTeam.indexOf(this.player);
        if (index !== -1) {
            this.redTeam.splice(index, 1);
        }

        this.blueTeam.push(this.player);
        this.player.setTexture('electrovoxPlayerBlue');
    }
    BioBarrelsDestroyed(){
        if(this.redBioEnergyCollected && this.blueBioEnergyCollected){
            this.scene.start('GameWonScene'); 
        } else {
            this.pauseGame('GAME OVER\nBarrels destroyed before sap retrieved');
        }
    }
}