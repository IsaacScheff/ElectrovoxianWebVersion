export default class Turret extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { scene, x, y, texture, team } = data;
        super(scene.matter.world, x, y, texture);
        this.scene.add.existing(this);
        this.team = team;
        this.enemies = [];

        this.maxHealth = 100;
        this.currentHealth = this.maxHealth;
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();

        // const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        // var turretCollider = Bodies.rectangle(x, y, 32, 64, { isSensor: false, label: 'turretCollider' });
        this.detectionArea = new Phaser.Geom.Circle(x, y, 200);

        // const compoundBody = Body.create({
        //     parts: [turretCollider],
        //     frictionAir: 0.35,
        // });
        // this.setExistingBody(compoundBody);
        this.setFixedRotation();

        this.lastFireTime = 0;
        this.cooldownPeriod = 3000; // cooldown in milliseconds
        this.lastDetectionTime = 0; // timestamp of last detection

        this.isHidden = false; //needed for enemies to shoot them

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
        this.updateHealthBar();
    }
    takeDamage(amount) { 
        if (!this.active) return;  // Skip if already destroyed
        console.log("bam!");
        this.currentHealth -= amount;
        if (this.currentHealth <= 0) {
            this.die();
        }
    }
    updateHealthBar() {
        if (!this.active) return;  // Skip updating the health bar if not active

        this.healthBar.clear();
        this.healthBar.setPosition(this.x - 30, this.y - 40);

        this.healthBar.fillStyle(0x808080, 1);
        this.healthBar.fillRect(0, 0, 60, 10);

        this.healthBar.fillStyle(0xff0000, 1);
        this.healthBar.fillRect(0, 0, 60 * (this.currentHealth / this.maxHealth), 10);
    }
    
    static preload(scene) {
        scene.load.image('turret', 'assets/images/FFTurret.png');
    }

    destroy() {
        super.destroy();
    }
    die() {
        console.log("Turret destroyed.");
        let teamArray = (this.team === 'red' ? this.scene.redTeamTurrets : this.scene.blueTeamTurrets);
        let teamIndex = teamArray.indexOf(this);
        if (teamIndex !== -1) {
            teamArray.splice(teamIndex, 1);
        }
        this.healthBar.destroy();
        this.destroy();  // Phaser's method to remove the sprite
    }
}




