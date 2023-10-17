import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild( renderer.domElement );


// Setup orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enableDamping = true;
controls.dampingFactor = 0.5;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.update();


// Vertex shader is unchanged, fragment shader maps the colours to greyscale
var vertexShader = `
  varying vec2 vUv;
  void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

var fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D greyTexture;

  void main() {
      vec4 color = texture2D(greyTexture, vUv);
      float grey = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      gl_FragColor = vec4(grey, grey, grey, 0.8); // Final value is alpha - for transparency
  }
`;


var sphereGeometry = new THREE.SphereGeometry(5, 32, 32);

// Load the texture using TextureLoader
var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load('2k_earth_daymap.jpg');

// Apply the texture to the material
var sphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
        greyTexture: { value: texture }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true, // Enable transparency
});


// Create the globe mesh by combining geometry and material
var globe = new THREE.Mesh(sphereGeometry, sphereMaterial);

const heights = [2, 299, 2422, 18638, 31149, 26008, 27519, 23368, 21392, 10904, 10577, 8360, 7700, 7260, 5800];

// Define latitude and longitude for the tangent point (in radians)
const tangentLatitude = 37.0902 * Math.PI / 180; // Example latitude (45 degrees)
const tangentLongitude = 95.7129 * Math.PI / 180; // Example longitude (90 degrees)

// Calculate the point on the globe where the line is tangent
const tangentPoint = new THREE.Vector3(
    Math.cos(tangentLatitude) * Math.cos(tangentLongitude) * 5, // Radius of the globe is 5
    Math.sin(tangentLatitude) * 5,
    Math.cos(tangentLatitude) * Math.sin(tangentLongitude) * 5
);

// Define the direction vector for the line (pointing outward from the globe)
const lineDirection = tangentPoint.clone().normalize();

// Length of the line
const lineLength = 5; // You can adjust the length of the line as needed

// Calculate the endpoint of the line
const lineEndpoint = tangentPoint.clone().add(lineDirection.multiplyScalar(lineLength));
const lineGeometry = new THREE.BufferGeometry().setFromPoints([tangentPoint, lineEndpoint]);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff00ff }); // You can set your desired line color here
const tangentLine = new THREE.Line(lineGeometry, lineMaterial);

// Add the tangent line to the scene
scene.add(tangentLine);

// Create truncated cones at specified heights with radii based on previous and current index values
for (let i = 1; i < heights.length; i++) {
  var lowerRadius;
  if (i === 0) {
    lowerRadius = 0;
  } else {
    lowerRadius = heights[i - 1];
  }

  const upperRadius = heights[i];
  const coneHeight = 0.5;

  const conePosition = tangentPoint.clone().add(lineDirection.clone().multiplyScalar(((i * coneHeight * 0.2) - 0.05)));

  const geometry = new THREE.CylinderGeometry(upperRadius * 0.0001, lowerRadius * 0.0001, coneHeight, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xdd0000 });
  const cone = new THREE.Mesh(geometry, material);

  // Position the cones along the tangent line
  cone.position.copy(conePosition);
  cone.lookAt(0, 0, 0);

  var quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
cone.quaternion.multiply(quaternion);


  // Add the cone to the scene
  scene.add(cone);
}



const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Color, Intensity
scene.add(ambientLight);


// Add the globe to the scene
scene.add(globe);








const lights = [];
function createLights() {
  // Create a point light source
  const center = new THREE.Vector3(0, 0, 0);
  const numLights = 6;
  const lightDistance = 25;
  for (let i = 0; i < numLights; i++) {
    const phi = Math.acos(-1 + (2 * i) / numLights); // Angle from top to bottom
    const theta = Math.sqrt(numLights * Math.PI * 2) * phi; // Angle around the sphere

    const light = new THREE.PointLight(0xffffff, 100);

    // Calculate the position using spherical coordinates
    light.position.x = center.x + lightDistance * Math.cos(theta) * Math.sin(phi);
    light.position.y = center.y + lightDistance * Math.sin(theta) * Math.sin(phi);
    light.position.z = center.z + lightDistance * Math.cos(phi);

    scene.add(light);

    // Make each light point at the cube
    light.target = new THREE.Vector3(0, 0, 0);
    lights.push(light);
  }
}

createLights();







camera.position.z = 20;

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  // controls.update();
}
animate();
