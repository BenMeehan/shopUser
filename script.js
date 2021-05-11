var mymap = L.map("mapid").setView([51.505, -0.09], 13);

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmVubWVlaGFuIiwiYSI6ImNrbzlseXVkbDB1OGUycXFrcW9nNWo0MWoifQ.W-dWZxXJuEf5XTl0uEna6Q",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "your.mapbox.access.token",
  }
).addTo(mymap);

var marker = L.marker([51.5, -0.09], { draggable: true, autoPan: true }).addTo(
  mymap
);

var shops = [];
var values = [];

var lat = 0;
var long = 0;

var shopname = document.getElementById("shopname");
var distance = document.getElementById("distance");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition);
} else {
  console.log("Allow Location access");
}

function distanceCalc(lat1, lat2, lon1, lon2) {
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  let r = 6371;

  return (c * r).toFixed(2);
}

function showPosition(position) {
  lat = position.coords.latitude;
  long = position.coords.longitude;

  mymap.setView([lat, long], 10);
  marker.setLatLng(new L.LatLng(lat, long));
}

const handleSubmit = () => {
  lat = marker.getLatLng().lat;
  long = marker.getLatLng().lng;
  $.get("retreive.php", { lat: lat, long: long }, function (data) {
    data = JSON.parse(data);
    for (i = 0; i < data.length; i++) {
      var shopIcon = L.icon({
        iconUrl: "shop.png",
        shadowUrl: "shop.png",

        iconSize: [32, 32],
        shadowSize: [0, 0],
        iconAnchor: [data[i].latitude, data[i].longitude],
        shadowAnchor: [data[i].latitude, data[i].longitude],
        popupAnchor: [data[i].latitude, data[i].longitude],
      });
      shops.push(
        L.marker([data[i].latitude, data[i].longitude], { icon: shopIcon })
      );
      shops[i].myId = i;
      shops[i].addTo(mymap);
      const obj = {
        name: data[i].name,
        lat: data[i].latitude,
        long: data[i].longitude,
      };
      values.push(obj);
      shops[i].on("click", (e) => {
        shopname.innerText = values[e.target.myId].name;
        distance.innerText =
          distanceCalc(
            lat,
            values[e.target.myId].lat,
            long,
            values[e.target.myId].long
          ) + " KM";
      });
    }
  });
};
