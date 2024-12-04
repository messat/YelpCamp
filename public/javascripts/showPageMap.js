const coordinatesFinder = showCampgroundMap
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12', 
  center: coordinatesFinder.geometry.coordinates, 
  zoom: 12, 
});

map.addControl(new mapboxgl.NavigationControl(), 'top-right');

new mapboxgl.Marker()
  .setLngLat(coordinatesFinder.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25})
    .setHTML(
      `<h4>${coordinatesFinder.properties.title}</h4><p><b>${coordinatesFinder.properties.location}</b></p>`
    )
  )
  .addTo(map)
