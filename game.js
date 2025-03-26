// Initialize Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Player controls
const player = { x: 0, y: 1.5, z: 0, speed: 0.1 };
const keys = {};

// Setup basic environment
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshBasicMaterial({ color: 0x228B22, side: THREE.DoubleSide })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Player object
const playerObj = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 1, 0.5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
playerObj.position.set(player.x, player.y, player.z);
scene.add(playerObj);

// Shooting setup
const bullets = [];
const bulletSpeed = 0.2;

// Movement & Looking
document.addEventListener("keydown", (e) => (keys[e.code] = true));
document.addEventListener("keyup", (e) => (keys[e.code] = false));

function updateMovement() {
    if (keys["KeyW"]) playerObj.position.z -= player.speed;
    if (keys["KeyS"]) playerObj.position.z += player.speed;
    if (keys["KeyA"]) playerObj.position.x -= player.speed;
    if (keys["KeyD"]) playerObj.position.x += player.speed;

    // Arrow keys for looking
    if (keys["ArrowLeft"]) camera.rotation.y += 0.02;
    if (keys["ArrowRight"]) camera.rotation.y -= 0.02;
}

// Mouse look
document.addEventListener("mousemove", (e) => {
    camera.rotation.y -= e.movementX * 0.002;
    camera.rotation.x -= e.movementY * 0.002;
});

// Shooting
document.addEventListener("keydown", (e) => {
    if (e.code === "ShiftLeft") {
        const bullet = new THREE.Mesh(
            new THREE.SphereGeometry(0.1),
            new THREE.MeshBasicMaterial({ color: 0xffff00 })
        );
        bullet.position.set(playerObj.position.x, playerObj.position.y, playerObj.position.z);
        bullets.push({ mesh: bullet, direction: camera.rotation.y });
        scene.add(bullet);
    }
});

// Bullet movement
function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].mesh.position.x -= Math.sin(bullets[i].direction) * bulletSpeed;
        bullets[i].mesh.position.z -= Math.cos(bullets[i].direction) * bulletSpeed;
    }
}

// Game Loop
function animate() {
    requestAnimationFrame(animate);
    updateMovement();
    updateBullets();
    renderer.render(scene, camera);
}

animate();
