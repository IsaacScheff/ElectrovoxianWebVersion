export default class Turret extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { scene, x, y, texture, team } = data;
        super(scene.matter.world, x, y, texture);
        this.scene.add.existing(this);
        this.team = team;

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        var turretCollider = Bodies.rectangle(x, y, 32, 64, { isSensor: false, label: 'turretCollider' });
        this.detectionArea = new Phaser.Geom.Circle(x, y, 164);

        const compoundBody = Body.create({
            parts: [turretCollider],
            frictionAir: 0.35,
        });
        this.setExistingBody(compoundBody);
        this.setFixedRotation();

        this.cooldownPeriod = 3000; // cooldown in milliseconds
        this.lastDetectionTime = 0; // timestamp of last detection

        // Register an event to check for entering objects
        this.scene.events.on('update', this.checkOverlap, this);
    }

    checkOverlap() {
        const Query = Phaser.Physics.Matter.Matter.Query;
        const bodies = this.scene.matter.world.localWorld.bodies;
    
        // Manually calculate the bounds of the circle
        const bounds = {
            min: { x: this.detectionArea.x - this.detectionArea.radius, y: this.detectionArea.y - this.detectionArea.radius },
            max: { x: this.detectionArea.x + this.detectionArea.radius, y: this.detectionArea.y + this.detectionArea.radius }
        };
    
        // Find bodies that are colliding with the detection area
        const collidingBodies = Query.region(bodies, bounds);
        const now = Date.now();
    
        if (now - this.lastDetectionTime >= this.cooldownPeriod) { //TODO: update this to prioritise electrovoxi over Harvestors
            for (let i = 0; i < collidingBodies.length; i++) {
                let body = collidingBodies[i];
                if (body.gameObject && body.gameObject.team && this.team !== body.gameObject.team) {
                    console.log(`Turret on team ${this.team} has detected an enemy from team ${body.gameObject.team}`);
                    this.lastDetectionTime = now;
                    break;  // Exit the loop after the first detection
                }
            }
        }
    }
    
    static preload(scene) {
        scene.load.image('turret', 'assets/images/FFTurret.png');
    }

    destroy() {
        // Clean up by removing event listener when the turret is destroyed
        this.scene.events.off('update', this.checkOverlap, this);
        super.destroy();
    }
}




