export default class Bullet extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, direction, speed, damage, enemies) {
        super(scene.matter.world, x, y, texture, damage, enemies);
        this.scene = scene;
        this.direction = direction;
        this.speed = speed;
        this.lifetime = 300;  // Lifetime of the bullet in milliseconds
        this.startX = x;
        this.startY = y;
        this.damage = damage;
        this.enemies = enemies;

        // Adding the bullet to the scene
        scene.add.existing(this);
        this.setVelocity(direction.x * speed, direction.y * speed);

        // Setting up collision events
        this.setOnCollide((pair) => {
            const target = pair.bodyA.gameObject;
            if (target && this.enemies.includes(target)) {
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

    destroy() {
        console.log("destroy called");
        super.destroy();  // Call the original destroy method
    }
}
