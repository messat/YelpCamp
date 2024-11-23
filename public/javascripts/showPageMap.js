const coordinatesFinder = JSON.parse(campground).geometry.coordinates
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: coordinatesFinder, // starting position [lng, lat]
  zoom: 10, // starting zoom
});

//pin - marker
new mapboxgl.Marker()
  .setLngLat(coordinatesFinder)
  .addTo(map)
