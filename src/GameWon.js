export default class GameWonScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameWonScene' });
    }

    preload() {
        //background art
    }

    create() {
        //text that says Congrats
        //press any key to return to menu
        this.input.keyboard.once('keydown', () => {
            this.scene.start('MainMenuScene'); 
        });
    }
}
