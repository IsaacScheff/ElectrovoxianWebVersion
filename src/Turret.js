export default class Turret extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { scene, x, y, texture, team } = data;
        super(scene.matter.world, x, y, texture, team);
        this.scene.add.existing(this);

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        var turretCollider = Bodies.rectangle(this.x, this.y, 32, 64, { isSensor: false, label: 'turretCollider' });
        var turretSensor = Bodies.circle(this.x, this.y, 164, { isSensor: true, label: 'turretSensor' });
        const compoundBody = Body.create({
            parts: [ turretCollider, turretSensor ],
            frictionAir: 0.35,
        });
        this.setExistingBody(compoundBody);
        this.setFixedRotation();
    }

    static preload(scene) {
        scene.load.image('turret', 'assets/images/FFTurret.png');
    }

}