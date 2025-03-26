// Display errors on screen
function showError(message) {
    let errorLog = document.getElementById("error-log");
    if (!errorLog) {
        errorLog = document.createElement("div");
        errorLog.id = "error-log";
        errorLog.style.position = "absolute";
        errorLog.style.top = "10px";
        errorLog.style.left = "10px";
        errorLog.style.color = "red";
        errorLog.style.fontSize = "16px";
        errorLog.style.background = "white";
        errorLog.style.padding = "10px";
        errorLog.style.display = "block";
        document.body.appendChild(errorLog);
    }
    errorLog.innerText = "Error: " + message;
}

// Wrap everything in a try-catch
try {
    // Initialize Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5).normalize();
    scene.add(light);

    // Load Player Model
    const loader = new THREE.GLTFLoader();
    loader.load(
        'hockey_player.glb',
        function (gltf) {
            const player = gltf.scene;
            player.scale.set(1, 1, 1); // Adjust scale
            player.position.set(0, 0, 0); // Set position
            scene.add(player);
        },
        undefined,
        function (error) {
            showError("Failed to load player model. Check file path.");
        }
    );

    // Set Camera Position
    camera.position.z = 5;

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
} catch (error) {
    showError(error.message);
}
