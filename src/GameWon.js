export default class GameWonScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameWonScene' });
    }

    preload() {
        this.load.image('background', 'assets/images/FragileFortunesSplashArt.png');
    }

    create() {
        let bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;
        
        this.add.text(this.scale.width / 2, this.scale.height * 0.25, 'Congratulations!', {
            font: '48px Arial',
            fill: '#ffff00',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: {
                offsetX: 4,
                offsetY: 4,
                color: '#000000',
                blur: 2,
                fill: true
            }
        }).setOrigin(0.5); 

        let returnText = this.add.text(this.scale.width / 2, this.scale.height * 0.75, 'Click here to return to Menu', {
            font: '24px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: {
                offsetX: 4,
                offsetY: 4,
                color: '#000000',
                blur: 2,
                fill: true
            }
        }).setOrigin(0.5).setInteractive(); 

        returnText.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}
