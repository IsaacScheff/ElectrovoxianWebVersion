import Electrovox from "./Electrovox";

export default class ElectrovoxSpawner {
    constructor(scene) {
        this.scene = scene;
        this.spawnInterval = 20000; // 20 seconds
        this.redTeamSpawns = [
            {x: 64, y: 1568},
            {x: 416, y: 1920},
            {x: 320, y: 1600}
        ]
        // this.blueTeamSpawns = [
        //     {x: y: },
        //     {x: y: },
        //     {x: y: }
        // ]

        this.scene.time.addEvent({
            delay: this.spawnInterval,
            callback: this.spawnMinions,
            callbackScope: this,
            loop: true
        });
    }

    spawnMinions() {
        this.redTeamSpawns.forEach(spawn => {
            for(let i = 0; i < 4; i++){ 
                new Electrovox({
                    scene: this.scene,
                    x: spawn.x + (i * 32), 
                    y: spawn.y,
                    texture: `electrovoxRedTeam`,
                    team: 'red'
                });
            }

        });

    }
}
