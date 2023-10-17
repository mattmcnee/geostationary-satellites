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

var countriesData = [
  {
    "country": "United States",
    "latitude": 37.0902,
    "longitude": -95.7129,
    "theme": 0x0000dd,
    "quantities": [2, 299, 2422, 18638, 31149, 26008, 27519, 23368, 21392, 10904, 10577, 8360, 7700, 7260, 5800]
  },
  {
    "country": "United Kingdom",
    "latitude": 53.5074,
    "longitude": -1.5278,
    "theme": 0x0000dd,
    "quantities": [0, 0, 14, 42, 436, 394, 492, 492, 422, 422, 422, 281, 281, 225, 225]
  },
  {
    "country": "Russia/Soviet Union",
    "latitude": 55.7558,
    "longitude": 37.6176,
    "theme": 0xdd0000,
    "quantities": [0, 5, 200, 1605, 6129, 11643, 19055, 30062, 39197, 37000, 27000, 21500, 17000, 7500, 6375]
  },
  {
    "country": "France",
    "latitude": 45.8566,
    "longitude": 2.3522,
    "theme": 0x0000dd,
    "quantities": [0, 0, 0, 0, 32, 36, 188, 250, 360, 505, 500, 470, 350, 300, 290]
  },
  {
    "country": "China",
    "latitude": 35.8617,
    "longitude": 104.1954,
    "theme": 0xaaaaaa,
    "quantities": [0, 0, 0, 0, 5, 75, 180, 205, 243, 232, 234, 232, 235, 260, 400]
  },
  // {
  //   "country": "Ukraine",
  //   "latitude": 48.3794,
  //   "longitude": 31.1656,
  //   "theme": 0x0000dd,
  //   "quantities": [0, 0, 0, 0, 0, 0, 0, 0, 0, 2321, 0, 0, 0, 0, 0]
  // },
  // {
  //   "country": "Kazakhstan",
  //   "latitude": 48.0196,
  //   "longitude": 66.9237,
  //   "theme": 0x0000dd,
  //   "quantities": [0, 0, 0, 0, 0, 0, 0, 0, 0, 1410, 0, 0, 0, 0, 0]
  // },
  {
    "country": "India",
    "latitude": 20.5937,
    "longitude": 78.9629,
    "theme": 0x0000dd,
    "quantities": [0, 0, 0, 0, 0, 0, 0, 1, 3, 7, 14, 28, 44, 100, 150]
  },
  {
    "country": "Pakistan",
    "latitude": 30.3753,
    "longitude": 69.3451,
    "theme": 0x0000dd,
    "quantities": [0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 13, 28, 38, 110, 160]
  },
  // {
  //   "country": "Belarus",
  //   "latitude": 53.7098,
  //   "longitude": 27.9534,
  //   "theme": 0x0000dd,
  //   "quantities": [0, 0, 0, 0, 0, 0, 0, 0, 0, 81, 0, 0, 0, 0, 0]
  // },
  // {
  //   "country": "Lithuania",
  //   "latitude": 55.1694,
  //   "longitude": 23.8813,
  //   "theme": 0x0000dd,
  //   "quantities": [0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0]
  // }
  {
  "country": "North Korea",
  "latitude": 40.3399,
  "longitude": 127.5101,
  "theme": 0x0000dd,
  "quantities": [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 8, 8, 35]
},
{
  "country": "South Africa",
  "latitude": -30.5595,
  "longitude": 22.9375,
  "theme": 0x0000dd,
  "quantities": [0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 0, 0, 0, 0, 0]
},
{
  "country": "Israel",
  "latitude": 31.0461,
  "longitude": 34.8516,
  "theme": 0x0000dd,
  "quantities": [0, 0, 0, 0, 0, 8, 20, 31, 42, 53, 63, 72, 80, 80, 85]
}



];









function createLineAt(lat, long, heights, theme) {

  const tangentLatitude = lat * Math.PI / 180;
  const tangentLongitude = long * Math.PI / -180;

  const tangentPoint = new THREE.Vector3(
    Math.cos(tangentLatitude) * Math.cos(tangentLongitude) * 5, 
    Math.sin(tangentLatitude) * 5,
    Math.cos(tangentLatitude) * Math.sin(tangentLongitude) * 5
  );

  // Define the direction vector for the line (pointing outward from the globe)
  const lineDirection = tangentPoint.clone().normalize();

  // Length of the line
  const lineLength = 4.3; // You can adjust the length of the line as needed

  // Calculate the endpoint of the line
  const lineEndpoint = tangentPoint.clone().add(lineDirection.multiplyScalar(lineLength));
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([tangentPoint, lineEndpoint]);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xcccccc });
  const tangentLine = new THREE.Line(lineGeometry, lineMaterial);

  // Add the tangent line to the scene
  scene.add(tangentLine);

  for (let i = 1; i < heights.length; i++) {
    var lowerRadius;
    if (i === 0) {
      lowerRadius = 0;
    } else {
      lowerRadius = heights[i - 1];
    }

    const upperRadius = heights[i];
    const coneHeight = 0.3;

    const conePosition = tangentPoint.clone().add(lineDirection.clone().normalize().multiplyScalar(((i * coneHeight * 1) - 0.05)));

    const geometry = new THREE.CylinderGeometry(Math.sqrt(upperRadius)* 0.007, Math.sqrt(lowerRadius) * 0.007, coneHeight, 32);
    const material = new THREE.MeshStandardMaterial({
      color: theme,
      transparent: true, 
      opacity: 1
    });
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

}







for (let i = 0; i < countriesData.length; i++) {
    createLineAt(countriesData[i].latitude, countriesData[i].longitude, countriesData[i].quantities, countriesData[i].theme);
}


// Calculate the point on the globe where the line is tangent


// Create truncated cones at specified heights with radii based on previous and current index values




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







camera.position.z = 15;

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  // controls.update();
}
animate();
