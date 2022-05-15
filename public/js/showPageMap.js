mapboxgl.accessToken =
  "pk.eyJ1IjoiemFpZGFsc2hyYWlmIiwiYSI6ImNsMzJ6ZzlmYTAzNHQzanBqcmtoNWgzaTAifQ.Vss04-m2CXFLHgqk6kUJjg";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: campground.geometry.coordinates,
  zoom: 8,
});

// Create a new marker.
const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
      .setHTML(`<h3>${campground.title}</h3>`)
    )
    .addTo(map);