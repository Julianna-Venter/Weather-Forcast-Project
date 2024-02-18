import { main } from "./api.js";
import { getLocalTimeAndDate } from "./geocoding.js";
import "./index.scss";

const subtitle = document.getElementById("subtitle");
const your_loc = document.getElementById("your-loc");
var map = "";
const display = document.getElementById("display-container");
const load_display = document.getElementById("load-container");

function init() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    throw new Error("Geolocation is not supported by this browser.");
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let currentdate = new Date();
  const day = document.getElementById("day");
  day.innerText = days[currentdate.getDay()] + ",";
  const date = document.getElementById("date");
  date.innerText =
    currentdate.getDate() +
    " " +
    months[currentdate.getMonth()] +
    " " +
    currentdate.getFullYear();
  const time = document.getElementById("time");

  const addZero = (number) => (number < 10 ? "0" + number : number);

  const hours = addZero(currentdate.getHours());
  const minutes = addZero(currentdate.getMinutes());

  time.innerText = hours + ":" + minutes;
}

function showPosition(position) {
  var geocoder = new google.maps.Geocoder();
  main(position.coords.latitude, position.coords.longitude);

  setMap(position.coords.latitude, position.coords.longitude);

  var latLng = new google.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude
  );
  geocoder.geocode({ location: latLng }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        var reversedAddress = results[0].formatted_address;
        your_loc.style.transition = "opacity 0.1s ease";
        your_loc.style.opacity = "1";
        subtitle.style.opacity = "0.7";
        subtitle.innerText = reversedAddress;
      } else {
        console.error("No results found");
      }
    } else {
      console.error("Geocoder failed due to: " + status);
    }
  });
}

function setMap(lat, lon) {
  if (map) {
    map.remove();
  }
  map = L.map("map").setView([lat, lon], 13);
  var marker = L.marker([lat, lon]).addTo(map);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  map.on("click", onMapClick);
}

function onMapClick(e) {
  const latitude = e.latlng.lat;
  const longitude = e.latlng.lng;
  main(latitude, longitude);
  getLocalTimeAndDate(latitude, longitude);
  setMap(latitude, longitude);

  var latLng = new google.maps.LatLng(latitude, longitude);
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ location: latLng }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        var reversedAddress = results[0].formatted_address;
        your_loc.style.transition = "opacity 0.1s ease";
        your_loc.style.opacity = "1";
        subtitle.style.opacity = "0.7";
        title.innerText = "Custom";
        subtitle.innerText = reversedAddress;
      } else {
        console.error("No results found");
      }
    } else {
      console.error("Geocoder failed due to: " + status);
    }
  });

  display.style.display = "none";
  load_display.style.display = "flex";
}

document.querySelectorAll("button#loc_btn").forEach(function (button) {
  button.addEventListener("click", function (event) {
    var buttonValue = event.target.textContent;
    title.innerText = buttonValue;
    your_loc.style.opacity = "0";
    if (buttonValue !== "Home") {
      handleSearch(buttonValue);
    } else {
      init();
    }
    display.style.display = "none";
    load_display.style.display = "flex";
  });
});

function handleSearch(address) {
  var geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: address }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var latitude = results[0].geometry.location.lat();
      var longitude = results[0].geometry.location.lng();
      main(latitude, longitude);
      getLocalTimeAndDate(latitude, longitude);
      setMap(latitude, longitude);
    } else {
      console.error(
        "Geocode was not successful for the following reason: " + status
      );
    }
  });
}

document.querySelectorAll("button#searchBtn").forEach(function (button) {
  button.addEventListener("click", function (event) {
    const searchInput = document.getElementById("searchInput");
    const inputValue = searchInput.value;
    const capitalizedString = inputValue.replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
    your_loc.style.transition = "opacity 0.1s ease";
    your_loc.style.opacity = "1";
    subtitle.style.opacity = "0.7";
    title.innerText = "Custom";
    subtitle.innerText = capitalizedString;
    handleSearch(inputValue);
    display.style.display = "none";
    load_display.style.display = "flex";
  });
});

init();
