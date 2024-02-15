import { populateDataDaily, populateDataHourly } from "./api.js";
import "./index.scss";

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
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
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
  time.innerText = currentdate.getHours() + ":" + currentdate.getMinutes();
}

var geocoder = new google.maps.Geocoder();
var address = "Pretoria";

geocoder.geocode({ address: address }, function (results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
    var latitude = results[0].geometry.location.lat();
    var longitude = results[0].geometry.location.lng();
  }
});

function showPosition(position) {
  populateDataHourly(position.coords.latitude, position.coords.longitude);
  populateDataDaily(position.coords.latitude, position.coords.longitude);
}

function search() {}

function submit() {}

init();
