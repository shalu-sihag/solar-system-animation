// Setup scene, camera, renderer
const scene = new THREE.Scene();

const container = document.getElementById('container');
const WIDTH = container.clientWidth;
const HEIGHT = container.clientHeight;

const camera = new THREE.PerspectiveCamera(
  45,
  WIDTH / HEIGHT,
  0.1,
  1000
);
camera.position.set(0, 50, 100);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0x000000); // black background
container.appendChild(renderer.domElement);

// Resize handler
window.addEventListener('resize', () => {
  const newWidth = container.clientWidth;
  const newHeight = container.clientHeight;
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
});

// Lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2, 300);
pointLight.position.set(0, 0, 0); // at Sun position
scene.add(pointLight);

// Sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planets data: name, size(radius), distance from sun, color
const planetsData = [
  { name: 'Mercury', size: 0.5, distance: 8, color: 0xbfbfbf },
  { name: 'Venus', size: 1.2, distance: 12, color: 0xeedd82 },
  { name: 'Earth', size: 1.3, distance: 16, color: 0x2a5bde },
  { name: 'Mars', size: 0.9, distance: 20, color: 0xde3b2f },
  { name: 'Jupiter', size: 3.5, distance: 28, color: 0xd2b48c },
  { name: 'Saturn', size: 3, distance: 36, color: 0xf5deb3 },
  { name: 'Uranus', size: 2.2, distance: 44, color: 0x66ccff },
  { name: 'Neptune', size: 2.1, distance: 50, color: 0x3355ff },
];

// Store planets and orbital speed
const planets = [];
const orbitalSpeeds = {};

// Create planet spheres & initialize speeds
planetsData.forEach(({ name, size, distance, color }) => {
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color });
  const planet = new THREE.Mesh(geometry, material);

  // Position initial - along x axis at 'distance'
  planet.position.x = distance;

  // Create an empty object as pivot for orbit rotation
  const pivot = new THREE.Object3D();
  pivot.add(planet);
  scene.add(pivot);

  planets.push({ name, mesh: planet, pivot, distance });

  // Default orbital speed (radians per second)
  orbitalSpeeds[name] = 0.01 + Math.random() * 0.02; // slower base speed
});

// Clock for animation timing
const clock = new THREE.Clock();

// Animation loop
function animate() {
  const delta = clock.getDelta();

  // Rotate Sun slowly
  sun.rotation.y += 0.002;

  // Update each planet's orbit rotation based on its speed
  planets.forEach(({ name, pivot }) => {
    pivot.rotation.y += orbitalSpeeds[name] * delta * 60; // adjust speed visually
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// Setup sliders for speed control
const slidersContainer = document.getElementById('sliders');

planets.forEach(({ name }) => {
  // Create container div for label + slider
  const wrapper = document.createElement('div');
  wrapper.className = 'slider-wrapper';

  const label = document.createElement('label');
  label.textContent = name;
  label.setAttribute('for', `slider-${name}`);

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.id = `slider-${name}`;
  slider.min = '0';
  slider.max = '0.05';  // limit max speed to avoid too fast orbit
  slider.step = '0.001';
  slider.value = orbitalSpeeds[name];
  slider.title = 'Adjust orbital speed';

  slider.addEventListener('input', (e) => {
    orbitalSpeeds[name] = parseFloat(e.target.value);
  });

  wrapper.appendChild(label);
  wrapper.appendChild(slider);
  slidersContainer.appendChild(wrapper);
});