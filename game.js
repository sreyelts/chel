document.getElementById("debug").innerText = "Starting game...";

try {
    // Initialize scene
    const scene = new THREE.Scene();
    document.getElementById("debug").innerText = "Scene created.";

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    document.getElementById("debug").innerText = "Camera set up.";

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    document.getElementById("debug").innerText = "Renderer initialized.";

    // Cube for testing
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    document.getElementById("debug").innerText = "Cube added.";

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();
    document.getElementById("debug").innerText = "Game running!";
} catch (error) {
    document.getElementById("debug").innerText = "Error: " + error.message;
}
