/* -----------
Google Maps demo.
Visualizing 45,716 Meteorite Landings. 
Data from NASA's Open Data Portal.(https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh)
----------- */

// API Key for Google Maps. Get one here:
// https://developers.google.com/maps/web/
let key = 'AIzaSyCpguaFMzdz0eBV16nAW5rquP8AaHttzYA'

// Style for Google Maps. This is optional. More information here:
// https://mapstyle.withgoogle.com/
let style = [
  {
    "featureType": "road.arterial",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]
// Options for map
let options = {
  lat: -25.190994,
  lng: 15.362848,
  zoom: 8,
  styles: style
}

// Create an instance of Google
let mappa = new Mappa('Google', key);
let myMap;

let canvas;
let meteorites;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);

  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
    
  // Load the data
  meteorites = loadTable('../../data/Meteorite_Landings.csv', 'csv', 'header');

  // Only redraw the meteorites when the map change and not every frame.
  myMap.onChange(drawMeteorites);

  fill(207, 204, 0);
  noStroke();
}

// The draw loop is fully functional but we are not using it for now.
function draw() {}


function drawMeteorites() {
  // Clear the canvas
  clear();
  
  for (let i = 0; i < meteorites.getRowCount(); i++) {
    // Get the lat/lng of each meteorite 
    let latitude = Number(meteorites.getString(i, 'reclat'));
    let longitude = Number(meteorites.getString(i, 'reclong'));

    // Only draw them if the position is inside the current map bounds. We use a
    // Google Map method to check if the lat and lng are contain inside the current
    // map. This way we draw just what we are going to see and not everything. See
    // getBounds() in https://developers.google.com/maps/documentation/javascript/3.exp/reference
    if (myMap.map.getBounds().contains({lat: latitude, lng: longitude})) {
      // Transform lat/lng to pixel position
      let pos = myMap.latLngToPixel(latitude, longitude);
      // Get the size of the meteorite and map it. 60000000 is the mass of the largest
      // meteorite (https://en.wikipedia.org/wiki/Hoba_meteorite)
      let size = meteorites.getString(i, 'mass (g)');
      size = map(size, 558, 60000000, 1, 25) + myMap.zoom();
      ellipse(pos.x, pos.y, size, size);
    }
  }
}