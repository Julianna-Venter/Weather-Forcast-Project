import { populateData } from "./api.js";
import "./index.scss";

function init() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    throw new Error("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  console.log(position.coords.latitude);
  console.log(position.coords.longitude);

  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  populateData(lat, lon);
}

function search() {}

function submit() {}

// function populateData(lat, lon) {}

init();
