export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        // Preload assets for the main menu, like button images or sounds
        this.load.image('playButton', 'assets/images/PlayGameButton.png');
        this.load.image('optionsButton', 'assets/images/OptionsButton.png');
        this.load.image('instructionsButton', 'assets/images/InstructionsButton.png');
        this.load.image('creditsButton', 'assets/images/CreditsButton.png');
    }

    create() {
        // Create the "Play Game" button
        this.playButton = this.add.sprite(this.cameras.main.centerX, 200, 'playButton').setInteractive();
        this.playButton.on('pointerup', () => {
            this.scene.start('MainScene');
        });

        // Create the "Instructions" button
        this.instructionsButton = this.add.sprite(this.cameras.main.centerX, 300, 'instructionsButton').setInteractive();
        this.instructionsButton.on('pointerup', () => {
            console.log('Open Instructions');
        });

        // Create the "Options" button
        this.optionsButton = this.add.sprite(this.cameras.main.centerX, 400, 'optionsButton').setInteractive();
        this.optionsButton.on('pointerup', () => {
            console.log('Open Options');
        });

        // Create the "Credits" button
        this.creditsButton = this.add.sprite(this.cameras.main.centerX, 500, 'creditsButton').setInteractive();
        this.creditsButton.on('pointerup', () => {
            console.log('Show Credits');
        });
    }
}
