export default class GameWonScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameWonScene' });
    }

    preload() {
        this.load.image('background', 'assets/images/FragileFortunesSplashArt.png');
    }

    create() {
        let bg = this.add.image(0, 0, 'background').setOrigin(0, 0);

        // Optionally scale or resize the background to cover the full game size
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;
        //text that says Congrats
        //press any key to return to menu
        this.input.keyboard.once('keydown', () => {
            this.scene.start('MainMenuScene'); 
        });
    }
}
