export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });

        this.creditText = "Ground tiles made by Stealthix\nAll sound effects sourced on Pixabay\nImages either made in Aseprite or with OpenAI"
        this.creditText += "\n\nCheck out the full source code at\nhttps://github.com/IsaacScheff/FragileFortunes";
    }

    create() {
        this.add.text(this.scale.width / 2, this.scale.height * 0.25, this.creditText, {
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

        returnText.on('pointerup', () => {
            this.scene.start('MainMenuScene');
        });
    }
}