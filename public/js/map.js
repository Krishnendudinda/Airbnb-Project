maptilersdk.config.apiKey = mapToken;
//mapboxgl.accessToken = mapToken;
const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element to render the map
    style: maptilersdk.MapStyle.STREETS, // stylesheet location
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

const marker = new maptilersdk.Marker({color: "red"})
    .setLngLat(listing.geometry.coordinates)//listing.geometry.coordinates
    .setPopup(
        new maptilersdk.Popup({offset: 25}).setHTML(
            `<h3>${listing.location}</h3><p>Exact Location will be provided after booking</p>`
        )    
    )
    marker.addTo(map);
