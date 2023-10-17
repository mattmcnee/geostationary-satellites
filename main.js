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
      gl_FragColor = vec4(grey, grey, grey, color.a);
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
    fragmentShader: fragmentShader
});


// Create the globe mesh by combining geometry and material
var globe = new THREE.Mesh(sphereGeometry, sphereMaterial);




var geometry = new THREE.BufferGeometry();
var vertices = [];
var indices = [];

// Define the number of segments and heights for your cylinder
var numSegments = 20;
var numHeights = 10;

// Create vertices for the cylinder with varying radii at different heights
for (var i = 0; i < numHeights; i++) {
    var radius = Math.random() * 5 + 1; // Random radius for each height
    for (var j = 0; j < numSegments; j++) {
        var theta = (j / numSegments) * Math.PI * 2;
        var x = radius * Math.cos(theta);
        var y = radius * Math.sin(theta);
        var z = i * 2; // Increase the height for each segment
        vertices.push(x, y, z);
    }
}

// Create indices for the faces of the cylinder
for (var i = 0; i < numHeights - 1; i++) {
    for (var j = 0; j < numSegments; j++) {
        var first = i * numSegments + j;
        var second = (i + 1) * numSegments + j;
        var third = (i + 1) * numSegments + (j + 1) % numSegments;
        var fourth = i * numSegments + (j + 1) % numSegments;
        indices.push(first, second, third);
        indices.push(first, third, fourth);
    }
}

// Set the vertices and indices to the buffer geometry
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
geometry.setIndex(indices);


var material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // You can use any material here
var cylinder = new THREE.Mesh(geometry, material2);
scene.add(cylinder);

















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
