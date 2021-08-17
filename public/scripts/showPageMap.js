mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v11', // style URL
	center: campground.geometry.coordinates, // starting position [lng, lat]
	zoom: 12 // starting zoom
});
// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker()
	.setLngLat(campground.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 }).setHTML(`<p></p><h5>${campground.title}</h5><p>${campground.location}</p>`)
	)
	.addTo(map);
map.addControl(new mapboxgl.NavigationControl());
