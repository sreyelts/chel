// Game.js

let scene, camera, renderer;
let cube;
let player;
let clock;
let controls;
let bullets = [];

function init() {
    // Initialize the scene
    scene = new THREE.Scene();

    // Camera setup (perspective view)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add lighting to the scene
    const light = new THREE.AmbientLight(0x404040); // Ambient light
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1).normalize();
    scene.add(directionalLight);

    // Add player (a simple cube for now)
    player = new THREE.Object3D();
    scene.add(player);
    const playerGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
    const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
    player.add(playerMesh);
    player.position.set(0, 0, 0);

    // Create a clock to track time for smooth movement
    clock = new THREE.Clock();

    // Initialize the FPS controls
    controls = new THREE.PointerLockControls(camera, document.body);
    scene.add(controls.getObject());

    // Event listener to start pointer lock (when clicking to start game)
    document.addEventListener('click', () => {
        controls.lock();
    });

    // Add keyboard controls for movement
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const moveSpeed = 0.1;

    // Listen for the keyboard to move player
    const onKeyDown = (event) => {
        switch (event.code) {
            case 'KeyW':
                direction.z = -moveSpeed;
                break;
            case 'KeyS':
                direction.z = moveSpeed;
                break;
            case 'KeyA':
                direction.x = -moveSpeed;
                break;
            case 'KeyD':
                direction.x = moveSpeed;
                break;
            case 'ShiftLeft':
                shootBullet();
                break;
        }
    };

    const onKeyUp = (event) => {
        switch (event.code) {
            case 'KeyW':
            case 'KeyS':
                direction.z = 0;
                break;
            case 'KeyA':
            case 'KeyD':
                direction.x = 0;
                break;
        }
    };

    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);

    // Shooting bullet on Shift key press
    function shootBullet() {
        const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
        bullet.position.set(camera.position.x, camera.position.y, camera.position.z);
        scene.add(bullet);

        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        bullet.velocity = direction.multiplyScalar(0.2);

        bullets.push(bullet);
    }

    // Update function to move player and bullets
    function update() {
        const delta = clock.getDelta();
        controls.moveRight(direction.x);
        controls.moveForward(direction.z);

        // Update bullets
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].position.add(bullets[i].velocity);
        }

        // Render the scene
        renderer.render(scene, camera);
    }

    // Main animation loop
    function animate() {
        requestAnimationFrame(animate);
        update();
    }

    animate();
}

// Start the game when the page is ready
window.onload = () => {
    init();
};
