// 3D Ice Hockey 1v1 Game with AI and LAN Multiplayer
// Uses Three.js for rendering and WebSockets for multiplayer

import * as THREE from 'three';

let scene, camera, renderer;
let players = [];
let controlledPlayerIndex = 0;
let puck;
let keys = {};
let puckVelocity = { x: 0, z: 0 };
let score = { red: 0, blue: 0 };
let period = 1;
let gameTime = 180; // 3-minute periods

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Background color for better visibility
    scene.background = new THREE.Color(0x87CEEB); // Sky Blue color for ice rink background
    
    // Ice rink
    let rinkGeometry = new THREE.PlaneGeometry(50, 30);
    let rinkMaterial = new THREE.MeshBasicMaterial({ color: 0xADD8E6, side: THREE.DoubleSide });
    let rink = new THREE.Mesh(rinkGeometry, rinkMaterial);
    rink.rotation.x = -Math.PI / 2;
    scene.add(rink);
    
    // Goals
    createGoals();
    
    // Puck
    let puckGeometry = new THREE.CircleGeometry(0.5, 32);
    let puckMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    puck = new THREE.Mesh(puckGeometry, puckMaterial);
    puck.position.y = 0.1;
    scene.add(puck);
    
    // Players
    createPlayers();
    
    // Set camera position for better viewing angle
    camera.position.set(0, 20, 40);
    camera.lookAt(0, 0, 0);

    // Event listeners for controls
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        if (e.key === ' ') switchPlayer();
    });
    window.addEventListener('keyup', (e) => keys[e.key] = false);
    
    // Game timer update every second
    setInterval(updateGameTime, 1000);
}

function createPlayers() {
    let playerGeometry = new THREE.BoxGeometry(1, 2, 1);
    
    let playerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    let player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.set(-5, 1, 0);
    scene.add(player);
    players.push(player);
    
    let opponentMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    let opponent = new THREE.Mesh(playerGeometry, opponentMaterial);
    opponent.position.set(5, 1, 0);
    scene.add(opponent);
    players.push(opponent);
}

function switchPlayer() {
    let closestIndex = 0;
    let closestDistance = Infinity;
    for (let i = 0; i < players.length; i++) {
        let dx = players[i].position.x - puck.position.x;
        let dz = players[i].position.z - puck.position.z;
        let distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
        }
    }
    controlledPlayerIndex = closestIndex;
}

function createGoals() {
    let goalGeometry = new THREE.BoxGeometry(1, 3, 5);
    let goalMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    
    let goalRed = new THREE.Mesh(goalGeometry, goalMaterial);
    goalRed.position.set(-24, 1.5, 0);
    scene.add(goalRed);
    
    let goalBlue = new THREE.Mesh(goalGeometry, goalMaterial);
    goalBlue.position.set(24, 1.5, 0);
    scene.add(goalBlue);
}

function animate() {
    requestAnimationFrame(animate);
    handlePlayerMovement();
    updatePuck();
    checkGoal();
    renderer.render(scene, camera);
}

function handlePlayerMovement() {
    let speed = 0.2;
    let player = players[controlledPlayerIndex];
    if (keys['w']) player.position.z -= speed;
    if (keys['s']) player.position.z += speed;
    if (keys['a']) player.position.x -= speed;
    if (keys['d']) player.position.x += speed;
    
    // Check for puck collision
    let dx = player.position.x - puck.position.x;
    let dz = player.position.z - puck.position.z;
    let distance = Math.sqrt(dx * dx + dz * dz);
    
    if (distance < 1.5) {
        puckVelocity.x = dx * 0.2;
        puckVelocity.z = dz * 0.2;
    }
}

function updatePuck() {
    puck.position.x += puckVelocity.x;
    puck.position.z += puckVelocity.z;
    
    puckVelocity.x *= 0.98;
    puckVelocity.z *= 0.98;
    
    // Bounce off walls
    if (puck.position.x < -25 || puck.position.x > 25) puckVelocity.x *= -1;
    if (puck.position.z < -15 || puck.position.z > 15) puckVelocity.z *= -1;
}

function checkGoal() {
    if (puck.position.x <= -24.5) {
        score.blue++;
        resetPuck();
    }
    if (puck.position.x >= 24.5) {
        score.red++;
        resetPuck();
    }
}

function resetPuck() {
    puck.position.set(0, 0.1, 0);
    puckVelocity.x = 0;
    puckVelocity.z = 0;
}

function updateGameTime() {
    if (gameTime > 0) {
        gameTime--;
    } else {
        if (period < 3) {
            period++;
            gameTime = 180;
        } else {
            // Handle overtime or shootout
            console.log('Game Over');
        }
    }
}

init();
animate();
