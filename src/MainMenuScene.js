import InstructionsScene from "./InstructionsScene";

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('mainMenuBackground', 'assets/images/FFMainMenuArt.png');
        this.load.image('logo', 'assets/images/FFLogo.png');
    }

    create() {
        let bg = this.add.image(0, 0, 'mainMenuBackground').setOrigin(0, 0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;

        this.logo = this.add.sprite(this.cameras.main.centerX, 145, 'logo');
        this.logo.scaleX = 0.5;
        this.logo.scaleY = 0.5;

        const buttonStyle = {
            fill: '#ffffff',
            font: '20px Arial',
            align: 'center'
        };

        const createButton = (x, y, text, callback) => {
            let button = this.add.rectangle(x, y, 200, 50, 0x000000, 0.8).setInteractive({ useHandCursor: true });
            this.add.text(x, y, text, buttonStyle).setOrigin(0.5);

            button.on('pointerover', () => { button.setFillStyle(0x555555, 0.8); });
            button.on('pointerout', () => { button.setFillStyle(0x000000, 0.8); });
            button.on('pointerdown', callback);
        };

        createButton(this.cameras.main.centerX, 340, 'Play Game', () => {
            this.scene.restart('MainScene');
            this.scene.start('MainScene', { startFresh: true });
        });
        createButton(this.cameras.main.centerX, 410, 'Instructions', () => {
            this.scene.start('InstructionsScene');
        });
        createButton(this.cameras.main.centerX, 480, 'Options', () => {
            this.scene.start('OptionsScene');
        });
        createButton(this.cameras.main.centerX, 550, 'Credits', () => {
            this.scene.start('CreditsScene');
        });

    }
}
