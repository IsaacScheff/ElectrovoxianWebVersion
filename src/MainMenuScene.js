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

        // Create the "Play Game" button
        this.playButton = this.add.sprite(280, 340, 'playButton').setInteractive();
        this.playButton.on('pointerup', () => {
            this.scene.start('MainScene', { startFresh: true });
        });

        // Create the "Instructions" button
        this.instructionsButton = this.add.sprite(500, 340, 'instructionsButton').setInteractive();
        this.instructionsButton.on('pointerup', () => {
            console.log('Open Instructions');
        });

        // Create the "Options" button
        this.optionsButton = this.add.sprite(280, 450, 'optionsButton').setInteractive();
        this.optionsButton.on('pointerup', () => {
            console.log('Open Options');
        });

        // Create the "Credits" button
        this.creditsButton = this.add.sprite(500, 450, 'creditsButton').setInteractive();
        this.creditsButton.on('pointerup', () => {
            this.scene.start('CreditsScene');
        });
    }
}
