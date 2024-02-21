/// <reference types="@types/googlemaps" />
/// <reference types="leaflet" />

import L from "leaflet";
import { main } from "./api.ts";
import { getLocalTimeAndDate } from "./geocoding.ts";
import "./index.scss";

const title = document.getElementById("title") as HTMLInputElement;
const subtitle = document.getElementById("subtitle") as HTMLInputElement;
const your_loc = document.getElementById("your-loc")as HTMLInputElement;
let map: L.Map | undefined;
const display = document.getElementById("display-container") as HTMLInputElement;
const load_display = document.getElementById("load-container")as HTMLInputElement;

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
  const day = document.getElementById("day") as HTMLInputElement;
  const date = document.getElementById("date") as HTMLInputElement;
  const time = document.getElementById("time") as HTMLInputElement;
  const addZero = (number) => (number < 10 ? "0" + number : number);
  const hours = addZero(currentdate.getHours());
  const minutes = addZero(currentdate.getMinutes());

  if (!day || !date || !time || !hours || !minutes){
    return;
  }

  day.innerText = days[currentdate.getDay()] + ",";
  date.innerText =
    currentdate.getDate() +
    " " +
    months[currentdate.getMonth()] +
    " " +
    currentdate.getFullYear();
  time.innerText = hours + ":" + minutes;
}

function showPosition(position) {
  let geocoder = new google.maps.Geocoder();
  main(position.coords.latitude, position.coords.longitude);

  setMap(position.coords.latitude, position.coords.longitude);

  let latLng = new google.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude
  );
  geocoder.geocode({ location: latLng }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0] && your_loc && subtitle) {
        let reversedAddress = results[0].formatted_address;
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
  let marker = L.marker([lat, lon]).addTo(map);

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

  let latLng = new google.maps.LatLng(latitude, longitude);
  let geocoder = new google.maps.Geocoder();
  geocoder.geocode({ location: latLng }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0] && your_loc && subtitle) {
        let reversedAddress = results[0].formatted_address;
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

  if (!display || !load_display){
    return;
  }

  display.style.display = "none";
  load_display.style.display = "flex";
}

document.querySelectorAll("button#loc_btn").forEach(function (button) {
  button.addEventListener("click", function (event) {
    if (!event.target || !your_loc || !display || !load_display){
      return;
    }
    let buttonValue = (event.target as HTMLElement).textContent;
    title.innerText = buttonValue !== null ? buttonValue : "";
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
  let geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: address }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      let latitude = results[0].geometry.location.lat();
      let longitude = results[0].geometry.location.lng();
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
    const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    if (!subtitle || !your_loc || !display || !load_display || !searchInput){
      return;
    }
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
