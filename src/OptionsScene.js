export default class OptionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OptionsScene' });
    }

    create() {
        this.add.text(this.scale.width / 2, this.scale.height * 0.25, "Yes, some options would be nice.", {
            font: '36px Arial',
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

        let returnText = this.add.text(this.scale.width / 2, this.scale.height * 0.65, 'Click here to return to Menu', {
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