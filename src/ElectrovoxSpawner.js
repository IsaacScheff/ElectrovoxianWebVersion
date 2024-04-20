import Electrovox from "./Electrovox";

export default class ElectrovoxSpawner {
    constructor(scene) {
        this.scene = scene;
        this.spawnInterval = 20000; // 20 seconds
        this.redTeamSpawns = [
            {x: 64, y: 1568, waypoints: [ {x:64, y:208}]}, 
            {x: 320, y: 1600, waypoints: [{x: 1024, y: 1024}]}, 
            {x: 416, y: 2016, waypoints: [{x: 1984, y: 2016}]}
        ]
        this.blueTeamSpawns = [
            {x: 2016, y: 416, waypoints: [{x: 1984, y: 2016}]},
            {x: 1600, y: 320, waypoints: [{x: 1024, y: 1024}]}, 
            {x: 1568, y: 32, waypoints: [{x:64, y:32}]}
        ]

        this.scene.time.addEvent({
            delay: this.spawnInterval,
            callback: this.spawnBoth,
            callbackScope: this,
            loop: true
        });
    }

    spawnBoth(){
        this.spawnMinions('red');
        this.spawnMinions('blue');
    }

    spawnMinions(team) { 
        const teamSpawns = (team == 'red' ? this.redTeamSpawns : this.blueTeamSpawns);
        teamSpawns.forEach((spawn, index) => {
            for (let i = 0; i < 4; i++) {
                let xPos, yPos;
    
                // Determine the position based on the spawn group
                switch (index) {
                    case 0: 
                        xPos = spawn.x; 
                        yPos = spawn.y + (i * 32); // Vertical line
                        break;
                    case 1: 
                        xPos = spawn.x + (i * 32); // Space them out diagonally
                        yPos = spawn.y + (i * 32);
                        break;
                    case 2: 
                        xPos = spawn.x + (i * 32); // Horizontal line
                        yPos = spawn.y; 
                        break;
                    default:
                        xPos = spawn.x + (i * 32); // Default to horizontal if more spawn points
                        yPos = spawn.y;
                        break;
                }
    
                let electrovox = new Electrovox({
                    scene: this.scene,
                    x: xPos,
                    y: yPos,
                    texture: (team ==  'red' ? `electrovoxRedTeam` : 'electrovoxBlueTeam'),
                    team: team,
                    waypoints: spawn.waypoints
                });
                electrovox.scaleX = 2;
                electrovox.scaleY = 2;
                electrovox.setFixedRotation();
                this.scene.electrovoxi.push(electrovox);
            }
        });
    }
}
