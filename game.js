// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting setup to make the player model visible
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040)); // Ambient light

// Player model (placeholder cube for now)
const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);

// Camera setup
camera.position.z = 5;

// Set up key movement controls (WASD for movement)
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

const keys = {};

// Keyboard event listeners
document.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

// Player speed and rotation settings
const playerSpeed = 0.1;
const rotationSpeed = 0.05;

// Movement logic
function updateMovement() {
    // Handle WASD input for player movement
    if (keys['KeyW']) {
        moveForward = true;
    }
    if (keys['KeyS']) {
        moveBackward = true;
    }
    if (keys['KeyA']) {
        moveLeft = true;
    }
    if (keys['KeyD']) {
        moveRight = true;
    }

    // Move player in the scene based on input
    if (moveForward) player.position.z -= playerSpeed;
    if (moveBackward) player.position.z += playerSpeed;
    if (moveLeft) player.position.x -= playerSpeed;
    if (moveRight) player.position.x += playerSpeed;

    // Reset movement after updating position
    moveForward = moveBackward = moveLeft = moveRight = false;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update player movement
    updateMovement();

    // Camera follows player
    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 5;

    // Rotation: Rotate player when moving
    if (moveForward || moveBackward || moveLeft || moveRight) {
        player.rotation.y += rotationSpeed;
    }

    // Render the scene
    renderer.render(scene, camera);
}

animate();
