import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Chart } from 'chart.js/auto';
import Papa from 'papaparse';



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxLAkYB9WYhQj5Bh2HCEISSfyqgosGfbU",
  authDomain: "all-the-nukes.firebaseapp.com",
  projectId: "all-the-nukes",
  storageBucket: "all-the-nukes.appspot.com",
  messagingSenderId: "548792933610",
  appId: "1:548792933610:web:c915afec264d551a018b93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);







// Your other code here

const initWidth = window.innerWidth;
const initHeight = window.innerHeight;

// Create a scene
const scene = new THREE.Scene();

// Create a camera with the correct aspect ratio
const aspectRatio = initWidth / initHeight;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

// Get a reference to the canvas element in your HTML
const canvas = document.querySelector('#app');
var canvasRect = canvas.getBoundingClientRect();

// Create a WebGLRenderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(initWidth, initHeight);

// Set the pixel ratio for better rendering on high-DPI screens
renderer.setPixelRatio(window.devicePixelRatio);

// Append the renderer's DOM element to the body
document.body.appendChild(renderer.domElement);







fetch('geo_satellite_data.json')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));



var locations = [
  {
    "country": "United States",
    "latitude": 37.0902,
    "longitude": -95.7129
  },
  {
    "country": "Canada",
    "latitude": 56.1304,
    "longitude": -106.3468
  },
  {
    "country": "United Kingdom",
    "latitude": 51.509865,
    "longitude": -0.118092
  },
  {
    "country": "Australia",
    "latitude": -25.2744,
    "longitude": 133.7751
  },
  {
    "country": "India",
    "latitude": 20.5937,
    "longitude": 78.9629
  }
]



var csv = `
Afghanistan,65,,65
Algeria,,32,32
Argentina,4,13,18
Australia,943,714,1657
Bahrain,179,359,538
Bangladesh,13,,13
Belgium,,0,0
Bhutan,0,,0
Bosnia-Herzegovina,12,,12
Brazil,26,7,32
Brunei,0,,0
Burkina Faso,1,,1
Canada,36,58,94
Chad,0,1,1
Chile,22,,22
Colombia,42,43,85
Congo,0,,0
Cote d'Ivoire,,1,1
Croatia,,29,29
Denmark,220,113,333
Dominican Republic,,5,5
Egypt,22,7,29
El Salvador,4,7,11
Estonia,2,,2
France,7,10,17
Georgia,,2,2
Germany,66,124,190
Greece,8,154,162
Guatemala,,4,4
Guyana,5,,5
Honduras,4,,4
India,307,219,526
Indonesia,101,14,115
Iraq,,11,11
Israel,440,422,862
Italy,204,214,418
Jamaica,16,,16
Japan,937,1224,2161
Jordan,22,23,46
Kosovo,10,,10
Kuwait,563,2014,2577
Latvia,,15,15
Lebanon,40,5,45
Lithuania,46,42,88
Luxembourg,,0,0
Malaysia,,26,26
Montenegro,1,2,3
Morocco,203,249,452
Netherlands,648,670,1317
New Zealand,,130,130
Niger,14,11,26
Nigeria,5,,5
North Macedonia,,6,6
Norway,455,848,1303
Oman,4,0,4
Panama,4,8,12
Paraguay,2,,2
Peru,1,14,15
Philippines,92,16,107
Poland,37,415,453
Portugal,4,,4
Qatar,1226,1302,2528
Romania,136,109,245
Russia,1,1,3
Rwanda,2,,2
Saudi Arabia,1318,1320,2637
Senegal,1,,1
Singapore,106,266,372
Slovenia,7,,7
South Korea,713,408,1120
Spain,30,86,115
Sri Lanka,54,,54
Sweden,115,318,433
Taiwan,122,140,262
Thailand,,49,49
Togo,10,5,15
Tunisia,2,3,5
Turkiye,18,25,44
Turkmenistan,18,,18
UAE,326,557,883
Ukraine,20,917,937
United Kingdom,875,724,1599
Uruguay,1,5,7
Viet Nam,54,0,54`;





Papa.parse(csv, {
  header: true,
  complete: function(results) {
    const data = results.data;
    console.log(results.data); // Array of objects with headers as keys

      function createCube(countryData) {
        const cubeSize = 0.1;
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        const cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial);


        // console.log(countryData)
        // console.log(countryData[""])

        const location = locations.find((loc) => loc.country === countryData[""]);

        if (location) {
          var coords0 = convertToCartesian(location.latitude, location.longitude, 5)
          var coords = convertToCartesian(location.latitude, location.longitude, 6)

          var mid = midPoint(location.latitude, location.longitude, 37.0902, -95.7129)
          var midCoords = convertToCartesian(mid.lat, mid.lon, 6)

          cube.position.set(coords);
          cube2.position.set(midCoords);
          console.log(countryData[""])

          var extraData = countryData.__parsed_extra
          console.log(extraData[2])
          scene.add(cube);
          scene.add(cube2);

          function convertToVector3(point) {
              return new THREE.Vector3(point.x, point.y, point.z);
          }

          // Assuming coords and midCoords are objects with x, y, z properties
          // var vectorCoords = convertToVector3(coords);
          // var vectorMidCoords = convertToVector3(midCoords);
          var newPoint = convertToCartesian(37.0902, -95.7129, 5);
          var newPoint0 = convertToCartesian(37.0902, -95.7129, 6);

          var points = [coords0, coords, midCoords, newPoint0, newPoint]; // Create an array of THREE.Vector3
          var curve = new THREE.CatmullRomCurve3(points);

          var width = Math.round(extraData[2])/10000;

          var tubeGeometry = new THREE.TubeGeometry(curve, 64, width, 8, false);
          var mesh = new THREE.Mesh(tubeGeometry, new THREE.MeshBasicMaterial({ color: getRandomColor() }));
          scene.add(mesh);


          // // Create a geometry from the curve
          // var curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));

          // // Create a material (e.g., LineBasicMaterial)
          // var curveMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

          // // Create a line with the geometry and material
          // var curveLine = new THREE.Line(curveGeometry, curveMaterial);

          // // Add the line to your scene
          // scene.add(curveLine);





        }else{
          cube.position.set(0, 0, 0);       
        }
        
      }

    for (const countryData of data) {
      createCube(countryData);
    }
  }
});



function midPoint(lat1, lon1, lat2, lon2) {
    // Handling Latitude
    var midLat = (lat1 + lat2) / 2;

    // Handling Longitude
    // Adjust longitudes if they cross the International Date Line
    if (Math.abs(lon1 - lon2) > 180) {
        if (lon1 > 0) {
            lon1 -= 360;
        } else {
            lon2 -= 360;
        }
    }
    var midLon = (lon1 + lon2) / 2;
    // Normalize the longitude to be within -180 to 180
    if (midLon < -180) {
        midLon += 360;
    } else if (midLon > 180) {
        midLon -= 360;
    }
    return { lat: midLat, lon: midLon };
}

function convertToCartesian(lat, lon, earthRadius) {
    const latitudeInRadians = lat * Math.PI / 180;
    const longitudeInRadians = -lon * Math.PI / 180;

    const x = earthRadius * Math.cos(latitudeInRadians) * Math.cos(longitudeInRadians);
    const y = earthRadius * Math.sin(latitudeInRadians);
    const z = earthRadius * Math.cos(latitudeInRadians) * Math.sin(longitudeInRadians);

    return new THREE.Vector3(x, y, z);
}

function getRandomColor() {
    const colors = [
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "#ffa600"
    ];

    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}





























// Setup orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enableDamping = true;
controls.dampingFactor = 0.5;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
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

createSphere();
var globe;
function createSphere(){

  var sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
  var texturePath = 'https://all-the-nukes.web.app/2k_earth_daymap.jpg';

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    texturePath = '2k_earth_daymap.jpg';
  } 

  
  // Load the texture using TextureLoader
  var textureLoader = new THREE.TextureLoader();
  var texture = textureLoader.load(texturePath);
  console.log("texture");

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
globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(globe);

}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Color, Intensity
scene.add(ambientLight);

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







camera.position.z = 12

function animate() {
  requestAnimationFrame( animate );

  renderer.render( scene, camera );
  controls.update();
}
animate();
