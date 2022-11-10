const austin = document.getElementById('austin');
const houston = document.getElementById('houston');
const dallas = document.getElementById('dallas');

let map;

const renderMapData = (lat, lon, zoom = 5.5) => {
  if (map) map.remove();
  map = L.map('map').setView([lat, lon], zoom);

  googleStreets = L.tileLayer(
    'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    },
  );
  googleStreets.addTo(map);
};

const init = async () => {
  console.log(austin);
  let initialMapData = await fetch('/api/maps/default');
  let { map_coordinates_lat, map_coordinates_lon } =
    await initialMapData.json();

  renderMapData(map_coordinates_lat, map_coordinates_lon);
};

const renderMapMarkers = (markers) => {
  let marker = new L.Marker([
    markers[0].marker_coordinates_lat,
    markers[0].marker_coordinates_lon,
  ]);
  marker.addTo(map);
};

const renderAustinMarkers = async (value) => {
  let austinMapData = await fetch(`/api/maps/${value}`);
  let { id, map_coordinates_lat, map_coordinates_lon } =
    await austinMapData.json();

  let austinMapMarkers = await fetch(`/api/markers/${id}`);
  let austinMarkerData = await austinMapMarkers.json();

  renderMapData(map_coordinates_lat, map_coordinates_lon, 11);

  renderMapMarkers(austinMarkerData);
};

// // Working function to double click to place marker on map and get coordinate data
// map.on('dblclick', (e) => {
//   L.marker(e.latlng).addTo(map);
//   document.getElementsByClassName('coordinate')[0].innerHTML = e.latlng.lat + e.latlng.lng;
//   console.log(e.latlng.lat, e.latlng.lng);
// });

init();

austin.addEventListener('click', (e) => {
  e.preventDefault();
  let value = austin.innerText;
  renderAustinMarkers(value);
});
