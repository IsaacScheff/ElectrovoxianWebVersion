import JungleCreep from "./JungleCreep.js";

export default class CreepSpawner {
    constructor(scene) {
        this.scene = scene;
        this.respawnTimer = 30000; // 30 seconds

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
            let creep = new JungleCreep({
                scene: this.scene,
                x: spawn.x,
                y: spawn.y,
                texture: 'thermalBeetle',
                team: 'neutral',
                index: index
            });
            creep.scaleX = 0.5;
            creep.scaleY = 0.5;
            creep.setFixedRotation();
            this.scene.creeps.push(creep);
        });
    }
    respawnCreep(creepIndex) {
        //respawn the creep after respawnTimer amoutn of time has passed
    }
}