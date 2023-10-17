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
      gl_FragColor = vec4(grey, grey, grey, 0.8); // Set the alpha to 0.5 for 50% transparency
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




const heights = [0, 1, 5, 6, 4, 2];

// Create truncated cones at specified heights with radii based on previous and current index values
for (let i = 1; i < heights.length; i++) {
  var lowerRadius;
  if( i == 0){
    lowerRadius = 0;
  }
  else{
    lowerRadius = heights[i - 1];
  }
    
    const upperRadius = heights[i];
    const coneHeight = 0.5;

    const geometry = new THREE.CylinderGeometry(upperRadius * 0.1, lowerRadius *0.1, coneHeight, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color, you can change it to your desired color
    const cone = new THREE.Mesh(geometry, material);

    // Position the cones at specified heights
    cone.position.set(0, 4.75+ i*coneHeight, 0);

    // Add the cone to the scene
    scene.add(cone);
}



















const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Color, Intensity
scene.add(ambientLight);


// Add the globe to the scene
scene.add(globe);

camera.position.z = 15;

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  controls.update();
}
animate();
