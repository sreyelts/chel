// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// Load hockey player model
const loader = new THREE.GLTFLoader();
let player;
loader.load('hockey_player.glb', function (gltf) {
    player = gltf.scene;
    player.position.set(0, 0, 0);
    scene.add(player);
}, undefined, function (error) {
    console.error("Error loading model:", error);
});

// Camera positioning
camera.position.set(0, 2, 5);
camera.lookAt(0, 0, 0);

// Handle player movement
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

function animate() {
    requestAnimationFrame(animate);

    if (player) {
        if (keys["ArrowUp"]) player.position.z -= 0.1; // Forward
        if (keys["ArrowDown"]) player.position.z += 0.1; // Backward
        if (keys["ArrowLeft"]) player.position.x -= 0.1; // Left
        if (keys["ArrowRight"]) player.position.x += 0.1; // Right
    }

    renderer.render(scene, camera);
}
animate();
