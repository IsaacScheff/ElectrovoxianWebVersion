import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import MainScene from './MainScene';
import MainMenuScene from './MainMenuScene';
import GameWonScene from './GameWon';
import CreditsScene from './CreditsScene';
import OptionsScene from './OptionsScene';
import InstructionsScene from './InstructionsScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0 },
            debug: false 
        }
    },
    plugins: {
        scene: [
            {
                plugin: PhaserMatterCollisionPlugin,
                key: 'matterCollision',
                mapping: 'matterCollision'
            }
        ]
    },
    scene: [MainMenuScene, MainScene, CreditsScene, OptionsScene, InstructionsScene, GameWonScene]
};

new Phaser.Game(config);
