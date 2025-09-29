export const UI = {
    statusElement: document.getElementById('status'),
    resetButton: document.getElementById('reset-btn'),
    canvasContainer: document.getElementById('canvas-container'),
    scene: null,
    camera: null,
    renderer: null,
    cubes: [],
    markers: [],
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),

    init(game, onCellClick, onReset) {
        this.setupScene();
        this.createBoard();
        this.updateStatus(game);
        this.canvasContainer.addEventListener('click', (event) => this.onCanvasClick(event, onCellClick));
        this.resetButton.addEventListener('click', onReset);
        this.animate();
    },

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);

        this.camera = new THREE.PerspectiveCamera(75, 600 / 600, 0.1, 1000);
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(600, 600);
        this.canvasContainer.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);

        // Add orbit controls for cool interaction
        // Note: OrbitControls not included in core Three.js, but for simplicity, we'll skip or add basic rotation
        // For full controls, would need to import OrbitControls
    },

    createBoard() {
        const size = 3;
        const spacing = 1.2;
        const cubeSize = 0.8;

        for (let z = 0; z < size; z++) {
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                    const material = new THREE.MeshLambertMaterial({
                        color: 0x4a90e2,
                        transparent: true,
                        opacity: 0.7
                    });
                    const cube = new THREE.Mesh(geometry, material);
                    cube.position.set(
                        (x - 1) * spacing,
                        (y - 1) * spacing,
                        (z - 1) * spacing
                    );
                    cube.userData = { x, y, z };
                    this.scene.add(cube);
                    this.cubes.push(cube);
                }
            }
        }
    },

    onCanvasClick(event, onCellClick) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.cubes);

        if (intersects.length > 0) {
            const cube = intersects[0].object;
            const { x, y, z } = cube.userData;
            onCellClick(x, y, z);
        }
    },

    renderBoard(board) {
        // Clear existing markers
        this.markers.forEach(marker => this.scene.remove(marker));
        this.markers = [];

        const size = 3;
        for (let z = 0; z < size; z++) {
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const index = z * size * size + y * size + x;
                    const player = board[index];
                    if (player) {
                        this.addMarker(x, y, z, player);
                    }
                }
            }
        }
    },

    addMarker(x, y, z, player) {
        const spacing = 1.2;
        const position = new THREE.Vector3(
            (x - 1) * spacing,
            (y - 1) * spacing,
            (z - 1) * spacing
        );

        let geometry, material;
        if (player === 'X') {
            // Create X shape using lines
            const points = [];
            points.push(new THREE.Vector3(-0.3, -0.3, 0));
            points.push(new THREE.Vector3(0.3, 0.3, 0));
            points.push(new THREE.Vector3(0.3, -0.3, 0));
            points.push(new THREE.Vector3(-0.3, 0.3, 0));
            geometry = new THREE.BufferGeometry().setFromPoints(points);
            material = new THREE.LineBasicMaterial({ color: 0xff6b6b, linewidth: 5 });
            const lines = new THREE.LineSegments(geometry, material);
            lines.position.copy(position);
            this.scene.add(lines);
            this.markers.push(lines);
        } else if (player === 'O') {
            geometry = new THREE.SphereGeometry(0.3, 16, 16);
            material = new THREE.MeshLambertMaterial({ color: 0x4ecdc4 });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.copy(position);
            this.scene.add(sphere);
            this.markers.push(sphere);
        }
    },

    updateStatus(game) {
        if (game.getWinner()) {
            if (game.getWinner() === 'Draw') {
                this.statusElement.textContent = "It's a draw!";
            } else {
                this.statusElement.textContent = `Player ${game.getWinner()} wins!`;
            }
        } else {
            this.statusElement.textContent = `Player ${game.getCurrentPlayer()}'s turn`;
        }
    },

    animate() {
        requestAnimationFrame(() => this.animate());
        // Rotate the scene slowly for cool effect
        this.scene.rotation.y += 0.005;
        this.renderer.render(this.scene, this.camera);
    }
};