export default class InstructionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InstructionsScene' });

        this.instructions = `Weave through the chaos using the arrow keys\
                            \naim your blaster with the WASD keys and fire with space bar\
                            \nPick up uniforms of the opposite color to switch teams\
                            \nand health packs to patch yourself up.`
        this.goals = `You need to collect 10 pieces of techonological scrap,\
                    \nsyphon some Bio Energy Sap from the barrels guarded by both teams\
                    \nthan aid either team in conquering the other to bring a respite to the fighting.\
                    \nIf you achieve all these goals you can escape your downtrodden planet.`
        this.fluff = `The alien Harvesters are fighting over the natural resource to power\
                    \ntheir weapons and spacecraft. Your fellow Electrovoxi are drafted in the conflict.\
                    \nKeep an eye out for the Thermal Beetles in the forest, they can sense your body heat.`
                            
    };

    create() {
        this.add.text(this.scale.width * 0.5, this.scale.height * 0.2, this.instructions, {
            font: '18px Arial',
            fill: '#4c64ba',
        }).setOrigin(0.5); 
        this.add.text(this.scale.width * 0.5, this.scale.height * 0.5, this.goals, {
            font: '18px Arial',
            fill: '#73b52b',
        }).setOrigin(0.5); 
        this.add.text(this.scale.width * 0.5, this.scale.height * 0.8, this.fluff, {
            font: '18px Arial',
            fill: '#b59e2b',
        }).setOrigin(0.5); 

        let returnText = this.add.text(this.scale.width / 2, this.scale.height * 0.95, 'Click here to return to Menu', {
            font: '24px Arial',
            fill: '#ffffff',
        }).setOrigin(0.5).setInteractive(); 

        returnText.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}