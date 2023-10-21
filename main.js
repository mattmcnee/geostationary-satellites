import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Chart } from 'chart.js/auto';



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



import { getStorage, ref, getDownloadURL } from "firebase/storage";

// Create a reference with an initial file path and name
const storage = getStorage();

// Create a reference from a Google Cloud Storage URI
const gsReference = ref(storage, 'gs://all-the-nukes.appspot.com/2k_earth_daymap.jpg');

// Get the download URL of the image
getDownloadURL(gsReference)
  .then((url) => {
    // Create an img element
    const img = document.createElement('img');

    // Set the src attribute of the img element to the download URL
    img.src = url;

    // Append the img element to a container in your HTML (assuming there is a container with id "image-container")
    const imageContainer = document.getElementById('image-container');
    imageContainer.appendChild(img);
  })
  .catch((error) => {
    // Handle errors
    console.error('Error getting download URL:', error);
  });







// Your other code here

const initWidth = window.innerWidth < 800 ? window.innerWidth * 0.8 : window.innerWidth / 2;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, (initWidth) / (window.innerHeight), 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#app'),
});
    renderer.setSize(initWidth, window.innerHeight);
 // Set renderer size to half of the window width
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  var newWidth = window.innerWidth/2;
  if (window.innerWidth < 800) {
    newWidth = window.innerWidth * 0.8;
  }
  const newHeight = window.innerHeight;
  // Update renderer size
  renderer.setSize(newWidth, newHeight);
  // Update camera aspect ratio
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  canvasRect = canvas.getBoundingClientRect();
});

const canvas = document.querySelector('#app');
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
var canvasRect = canvas.getBoundingClientRect(); // Get canvas position and dimensions

document.addEventListener('mousemove', (event) => {
    // Normalize mouse coordinates to NDC
    mouse.x = ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
    mouse.y = -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(globe);
    // console.log(intersects.length);
    if (intersects.length > 0) {
        canvas.style.cursor = "move";
    } else {
        canvas.style.cursor = "default";
    }
});



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

  // var imageUrl = "https://drive.google.com/uc?id=1A3xl3Pu9k4S5KVWy0Dfo5gdqEHWSzZeV";
  // var texture = textureLoader.load(imageUrl);

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





var countriesData = [
  {
    "country": "United States",
    "latitude": 37.0902,
    "longitude": -95.7129,
    "theme": 0x0000dd,
    "quantities": [0, 2, 299, 2422, 18638, 31149, 26008, 27519, 23368, 21392, 10904, 10577, 8360, 7700, 7260, 5800]
  },
  {
    "country": "United Kingdom",
    "latitude": 53.5074,
    "longitude": -1.5278,
    "theme": 0x191970,
    "quantities": [0, 0, 0, 14, 42, 436, 394, 492, 492, 422, 422, 422, 281, 281, 225, 225]
  },
  {
    "country": "Russia/Soviet Union",
    "latitude": 55.7558,
    "longitude": 37.6176,
    "theme": 0xdd0000,
    "quantities": [0, 0, 5, 200, 1605, 6129, 11643, 19055, 30062, 39197, 37000, 27000, 21500, 17000, 7500, 6375]
  },
  {
    "country": "France",
    "latitude": 45.8566,
    "longitude": 2.3522,
    "theme": 0x0047AB,
    "quantities": [0, 0, 0, 0, 0, 32, 36, 188, 250, 360, 505, 500, 470, 350, 300, 290]
  },
  {
    "country": "China",
    "latitude": 35.8617,
    "longitude": 104.1954,
    "theme": 0xaaaaaa,
    "quantities": [0, 0, 0, 0, 0, 5, 75, 180, 205, 243, 232, 234, 232, 235, 260, 400]
  },
  {
    "country": "India",
    "latitude": 20.5937,
    "longitude": 78.9629,
    "theme": 0xaaaaaa,
    "quantities": [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 7, 14, 28, 44, 100, 150]
  },
  {
    "country": "Pakistan",
    "latitude": 30.3753,
    "longitude": 69.3451,
    "theme": 0xaaaaaa,
    "quantities": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 13, 28, 38, 110, 160]
  },
  {
  "country": "North Korea",
  "latitude": 40.3399,
  "longitude": 127.5101,
  "theme": 0x0000dd,
  "quantities": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 8, 8, 35]
  },
  {
    "country": "South Africa",
    "latitude": -30.5595,
    "longitude": 22.9375,
    "theme": 0xaaaaaa,
    "quantities": [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 0, 0, 0, 0, 0]
  },
  {
    "country": "Israel",
    "latitude": 31.0461,
    "longitude": 34.8516,
    "theme": 0x0000dd,
    "quantities": [0, 0, 0, 0, 0, 0, 8, 20, 31, 42, 53, 63, 72, 80, 80, 85]
  },
  // {
  //   "country": "Belarus",
  //   "latitude": 53.7098,
  //   "longitude": 27.9534,
  //   "theme": 0x0000dd,
  //   "quantities": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 81, 0, 0, 0, 0, 0]
  // },
  // {
  //   "country": "Lithuania",
  //   "latitude": 55.1694,
  //   "longitude": 23.8813,
  //   "theme": 0x0000dd,
  //   "quantities": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0]
  // },
  // {
  //   "country": "Ukraine",
  //   "latitude": 48.3794,
  //   "longitude": 31.1656,
  //   "theme": 0x0000dd,
  //   "quantities": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2321, 0, 0, 0, 0, 0]
  // },
  // {
  //   "country": "Kazakhstan",
  //   "latitude": 48.0196,
  //   "longitude": 66.9237,
  //   "theme": 0x0000dd,
  //   "quantities": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1410, 0, 0, 0, 0, 0]
  // }
];

let ignoreList = ["Lithuania", "Belarus", "Kazakhstan", "Ukraine"];


var usingLog = false;

  var myDiv = document.getElementById("log");

  // Add a click event listener to the div
  myDiv.addEventListener("click", function() {
    usingLog = !usingLog;
    createChart();
    addMapData();
    myDiv.textContent = usingLog ? "Switch to linear" : "Switch to logarithmic";
  });



var ctx = document.getElementById('myLineChart').getContext('2d');
var years = [1940, 1945, 1950, 1955, 1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2014, 2020];
var lineChart = null;
var yTickValues = [0, 10, 100, 1000, 10000, 100000];
createChart();

function createChart() {
  var datasets = countriesData.map(function(country) {
      return {
          label: country.country,
          borderColor: '#' + country.theme.toString(16).padStart(6, '0'),
          data: country.quantities.map(function(quantity, index) {
              // Map the logarithm of the quantities to an object with x and y properties
              // Adding 1 to avoid logarithm of 0, and then applying logarithm
            if(usingLog){
              var yValue = Math.log(quantity + 1);
              // var logValue = Math.log(quantity + 1);
              // var closestTickValue = yTickValues.reduce(function(prev, curr) {
              //   return Math.abs(curr - logValue) < Math.abs(prev - logValue) ? curr : prev;
              // });
              // yValue = closestTickValue;
              return { x: years[index], y: yValue };
            }else{
              return { x: years[index], y: quantity };
            }
          }),
          fill: false
      };
  });

  if (lineChart) {
        lineChart.destroy();
  }

var chartColours =
  {
    "text": "#eeeeee",
    "grid": "#444444"
  };

var stepSize = usingLog ? Math.log(10) : undefined;
  lineChart = new Chart(ctx, {
      type: 'line',
      data: {
          datasets: datasets
      },
options: {
    scales: {
        x: {
            type: 'linear',
            position: 'bottom',
            title: {
                display: true,
                text: 'Year',
                color: chartColours.text
            },
            ticks: {
                color: chartColours.text,
                callback: function(value) {
                    return value.toString(); // Convert the tick value to a string without commas
                }
            },
            grid: {
                color: chartColours.grid
            }
        },
        y: {
            type: 'linear',
            position: 'left',
            title: {
                display: true,
                text: 'Estimated Warheads',
                color: chartColours.text
            },
            ticks: {
                color: chartColours.text,
                stepSize: stepSize,
                callback: function(value) {
                    // console.log(value);
                    if (usingLog && value != 0) {
                        return Math.round(Math.exp(value));
                    } else {
                        return value;
                    }
                }
            },
            grid: {
                color: chartColours.grid
            }
        }
    },
    plugins: {
        legend: {
            labels: {
                color: chartColours.text,
                pointStyle: 'dash', // Options: 'circle', 'triangle', 'rect', 'rectRounded', 'rectRot', 'cross', 'crossRot', 'line', 'dash'
                usePointStyle: true
            }
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    var label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (usingLog) {
                        label += Math.round(Math.exp(context.parsed.y) - 1);
                    } else {
                        label += context.parsed.y;
                        // Display the original quantity
                    }
                    return label;
                }
            }
        }
    }

      }
  });
}








// var numCircles = 14;
// var circles = [];
// for (var i = 0; i < numCircles; i++) {
//   var segments = 64;
//   var radius = 5.3 + i*0.3;
//   var circleGeometry = new THREE.CircleGeometry(radius, segments);
//   var material = new THREE.LineBasicMaterial({ color: 0x555555 });

// // Create lines using the geometries and material
// var circle = new THREE.LineLoop(circleGeometry, material);
// scene.add(circle);
// circles.push(circle);
// }




// Add the circle mesh to the scene
// scene.add(circleMesh);



function adjustData(data, withLog) {
  if (data === 0) {
    return 0;
  }
  if (withLog) {
    return Math.log(data) * 0.05;
  } else {
    return data * 0.00007;
  }
}








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
  const lineLength = 4.2; // You can adjust the length of the line as needed

  // Calculate the endpoint of the line
  const lineEndpoint = tangentPoint.clone().add(lineDirection.multiplyScalar(lineLength));
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([tangentPoint, lineEndpoint]);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x777777 });
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

    const conePosition = tangentPoint.clone().add(lineDirection.clone().normalize().multiplyScalar(((i * coneHeight * 1) - 0.15)));

    const geometry = new THREE.CylinderGeometry(adjustData(upperRadius, usingLog), adjustData(lowerRadius, usingLog), coneHeight, 32);
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
    coneInstances.push(cone);
  }

}


let coneInstances = [];
function addMapData() {
  // Check if coneInstances is populated (not empty) before trying to loop over it
  if (coneInstances.length > 0) {
    for (const cone of coneInstances) {
      scene.remove(cone);
    }
  }

  for (let i = 0; i < countriesData.length; i++) {
      if (!ignoreList.includes(countriesData[i].country)) {
          createLineAt(countriesData[i].latitude, countriesData[i].longitude, countriesData[i].quantities, countriesData[i].theme);
      }
  }
}

addMapData();





// Calculate the point on the globe where the line is tangent


// Create truncated cones at specified heights with radii based on previous and current index values




const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Color, Intensity
scene.add(ambientLight);


// Add the globe to the scene









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







camera.position.z = 18

function animate() {
  requestAnimationFrame( animate );

  // for (const circle of circles) {
  //     circle.lookAt(camera.position);
  // }

  renderer.render( scene, camera );
  controls.update();
}
animate();
