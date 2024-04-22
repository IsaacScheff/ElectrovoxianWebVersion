export default class Turret extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { scene, x, y, texture, team } = data;
        super(scene.matter.world, x, y, texture);
        this.scene.add.existing(this);
        this.team = team;
        this.enemies = [];

        // const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        // var turretCollider = Bodies.rectangle(x, y, 32, 64, { isSensor: false, label: 'turretCollider' });
        this.detectionArea = new Phaser.Geom.Circle(x, y, 164);

        // const compoundBody = Body.create({
        //     parts: [turretCollider],
        //     frictionAir: 0.35,
        // });
        // this.setExistingBody(compoundBody);
        this.setFixedRotation();

        this.lastFireTime = 0;
        this.cooldownPeriod = 3000; // cooldown in milliseconds
        this.lastDetectionTime = 0; // timestamp of last detection

    }

    update(time, delta) {
        this.enemies = (this.team === 'red') ? this.scene.blueTeam : this.scene.redTeam;
        // Check if cooldown has elapsed
        if (time > this.lastFireTime + this.cooldownPeriod) {
            this.enemies.forEach(enemy => { // Assuming you have a list of enemies
                if (enemy.active && Phaser.Geom.Circle.ContainsPoint(this.detectionArea, enemy)) {
                    if (enemy.team !== this.team) {
                        console.log(`Turret on team ${this.team} has detected an enemy from team ${enemy.team}`);
                        enemy.takeDamage(30); // Deal damage or whatever effect you want
                        this.lastFireTime = time;
                        return; // Exit after the first target is engaged
                    }
                }
            });
        }
    }
    
    static preload(scene) {
        scene.load.image('turret', 'assets/images/FFTurret.png');
    }

    destroy() {
        super.destroy();
    }
}




