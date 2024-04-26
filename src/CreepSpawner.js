import JungleCreep from "./JungleCreep.js";

export default class CreepSpawner {
    constructor(scene) {
        this.scene = scene;
        this.respawnTimer = 5000; // 30 seconds
        this.creepSpawns = [
            {x: 1024, y: 448},
            {x: 992, y: 1600},
            {x: 1408, y: 1664},
            {x: 608, y: 352},
            {x: 416, y: 1216},
            {x: 1600, y: 832},
            {x: 1664, y: 1248},
            {x: 352, y: 768},
        ]
    }
    spawnCreeps() { 
        this.creepSpawns.forEach((spawn, index) => {
            this.spawnCreepAt(index);
        });
    }
    spawnCreepAt(index) {
        const spawn = this.creepSpawns[index];
    
        if (!spawn) {
            console.error("Invalid spawn data for index:", index);
            return; // Stop the function if spawn data is invalid
        }
    
        let creep = new JungleCreep({
            scene: this.scene,
            x: spawn.x,
            y: spawn.y,
            texture: 'thermalBeetle',
            team: 'neutral',
            indexOfSpawn: index
        });
        creep.scaleX = 0.5;
        creep.scaleY = 0.5;
        creep.setFixedRotation();
        this.scene.creeps.push(creep);
    }
    respawnCreep(creepIndex) {
        this.scene.time.delayedCall(
            this.respawnTimer, 
            this.spawnCreepAt.bind(this, creepIndex), // Binding 'this' and passing 'creepIndex' directly
            [], // No additional arguments are needed here since they're bound
            this 
        );
    }
}