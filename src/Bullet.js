export default class Bullet extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, direction, speed, damage, enemies) {
        super(scene.matter.world, x, y, texture, damage, enemies);
        this.scene = scene;
        this.direction = direction;
        this.speed = speed;
        this.lifetime = 1000;  // Lifetime of the bullet in milliseconds
        this.travelDistance = 500;  // Maximum travel distance
        this.startX = x;
        this.startY = y;
        this.damage = damage;
        this.enemies = enemies;

        // Adding the bullet to the scene
        scene.add.existing(this);
        this.scene.bullets.push(this);
        this.setVelocity(direction.x * speed, direction.y * speed);

        // Setting up collision events
        this.setOnCollide((pair) => {
            const target = pair.bodyA.gameObject;
            if (target && target.takeDamage) {
                target.takeDamage(this.damage);
            }
            this.destroy();  // Destroy the bullet on collision
        });

        // Destroy the bullet after its lifetime
        scene.time.delayedCall(this.lifetime, () => {
            if (this.scene && this.scene.matter.world) {  // Check if the scene and world still exist
                this.destroy();
            }
        }, [], this);
    }
    update(time, delta) {
        // Destroy the bullet if it travels beyond its max distance
        if (Phaser.Math.Distance.Between(this.startX, this.startY, this.x, this.y) > this.travelDistance) {
            this.destroy();
        }
    }

    destroy() {
        console.log("destroy called");
        let index = this.scene.bullets.indexOf(this);
        if (index !== -1) {
            this.scene.bullets.splice(index, 1);  // Remove from array
        }
        super.destroy();  // Call the original destroy method
    }
}
