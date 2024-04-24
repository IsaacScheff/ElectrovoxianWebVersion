import Jungler from "./Jungler.js"
import Laner from "./Laner.js";

export default class HarvesterSpawner {
    constructor(scene) {
        this.scene = scene;
        this.respawnTimer = 20000; // 20 seconds
        this.redTeamSpawns = [
            //{x: 64, y: 1568, waypoints: [ {x:64, y:208}], role: "toplane"}, 
            //{x: 320, y: 1600, waypoints: [{x: 1024, y: 1024}], role: "midlane"}, 
            //{x: 416, y: 2016, waypoints: [{x: 1984, y: 2016}], role: "botlane"}
            {x: 64, y: 1568, waypoints: [ {x:64, y:208}, {x: 464, y: 128}, {x: 954, y: 128}, {x:1504, y: 128}]}, 
            {x: 320, y: 1600, waypoints: [{x: 1024, y: 1024},{ x: 1564, y: 432 }, { x: 1364, y: 632 }, { x: 1164, y: 832 }]}, 
            {x: 416, y: 2016, waypoints: [{x: 1984, y: 2016}, { x: 1920, y: 544 }, { x: 1920, y: 1084 }, { x: 1920, y: 1584 },]},
            {x: 64, y: 2016, 
                waypoints: [
                    {x: 1024, y: 448},
                    {x: 992, y: 1600},
                    {x: 1408, y: 1664},
                    {x: 608, y: 352},
                    {x: 416, y: 1216},
                    {x: 1600, y: 832},
                    {x: 1664, y: 1248},
                    {x: 352, y: 768},
                ],
                role: "jungler"
            }
        ]
        // this.blueTeamSpawns = [
        //     {x: 2016, y: 416, waypoints: [{x: 1984, y: 2016}, { x: 1584, y: 1920 }, { x: 1084, y: 1920 }, { x: 544, y: 1920 }]},
        //     {x: 1600, y: 320, waypoints: [{x: 1024, y: 1024}, { x: 848, y: 1136 }, { x: 648, y: 1336 }, { x: 448, y: 1536 }]}, 
        //     {x: 1568, y: 32, waypoints: [{x:64, y:32}, { x: 128, y: 1504 }, { x: 128, y: 964 }, { x: 128, y: 464 },]}
        // ]
    }

    spawnBoth(){
        this.spawnHarvesters('red');
        //this.spawnHarvesters('blue');
    }

    spawnHarvesters(team) { 
        const teamSpawns = (team == 'red' ? this.redTeamSpawns : this.blueTeamSpawns);
        teamSpawns.forEach((spawn) => {
            let harvester = new (spawn.role === "jungler" ? Jungler : Laner)({
                scene: this.scene,
                x: spawn.x,
                y: spawn.y,
                texture: (spawn.role === 'jungler' ? 'gravithor' : 'quantumSentinel'), 
                team: team,
                waypoints: spawn.waypoints,
                role: spawn.role
            });
            console.log(harvester);
            if(harvester.role === "jungler"){
                harvester.scaleX = 0.75;
                harvester.scaleY = 0.75;
            }
            harvester.setFixedRotation();
            (team === 'red' ? this.scene.redHarvesters : this.scene.blueHarvesters).push(harvester);
            (team === 'red' ? this.scene.redTeam : this.scene.blueTeam).push(harvester);
        });
    }
}
