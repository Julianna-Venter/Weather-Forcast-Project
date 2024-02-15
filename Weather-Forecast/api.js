export function populateDataHourly(lat, lon) {
  fetch(
    `http://www.7timer.info/bin/api.pl?lon='${lat}'&lat='${lon}'&product=astro&output=json`
  )
    .then((response) => response.json()) //pass as json
    .then((jsonresponse) => {
      if (!jsonresponse?.dataseries) {
        throw new Error("Test catch?");
      }

      const results = jsonresponse.dataseries;

      for (let result of results) {
        let wind = "";
        if (result?.wind10m?.direction && result?.wind10m?.speed) {
          wind += `${result.wind10m.speed}km/h ${result.wind10m.direction}`;
          const wind_display = document.getElementById("wind");
          wind_display.innerText = wind;
        }

        let humidity = "";
        if (result?.rh2m) {
          humidity += `${result.rh2m}%`;
          const humid = document.getElementById("humidity");
          humid.innerText = humidity;
        }

        let temp = "";
        if (result?.temp2m) {
          temp += `${result.temp2m}ºC`;
          const curr_temp = document.getElementById("curr_temp");
          curr_temp.innerText = temp;
        }

        let precip = "";
        if (result?.temp2m) {
          precip += `${result.prec_type}`;
          const curr_precip = document.getElementById("precip");
          curr_precip.innerText = precip;
        }

        break;
      }
    })
    .catch((error) => console.error(error))
    .finally(() => console.log("The network call has been finalised"));
}

export function populateDataDaily(lat, lon) {
  fetch(
    "http://www.7timer.info/bin/api.pl?lon='${lat}'&lat='${lon}'&product=civillight&output=json"
  )
    .then((response) => response.json())
    .then((jsonresponse) => {
      if (!jsonresponse?.dataseries) {
        throw new Error("Test catch?");
      }

      const results = jsonresponse.dataseries;

      for (let result of results) {
        let min = "";
        let max = "";
        if (result?.temp2m?.min && result?.temp2m?.max) {
          min += `${result.temp2m.min}ºC`;
          max += `${result.temp2m.max}ºC`;
          const min_display = document.getElementById("low");
          min_display.innerText = min;
          const max_display = document.getElementById("high");
          max_display.innerText = max;
        }

        const weatherMappings = {
          ts: "Thunder Showers",
          pcloudy: "Partly Cloudy",
          ishower: "Isolated Showers",
          lightrain: "Light Rain",
          clear: "Clear",
        };

        const weatherIcons = {
          ts: "<i class='fa-solid fa-cloud-bolt'></i>",
          pcloudy: "<i class='fa-solid fa-cloud-sun'></i>",
          ishower: "<i class='fa-solid fa-cloud-showers-heavy'></i>",
          lightrain: "<i class='fa-solid fa-cloud-showers'></i>",
          clear: "<i class='fa-solid fa-sun'></i>",
        };

        if (result?.weather) {
          const shorthandCode = result.weather.toLowerCase();
          const fullWeather = weatherMappings[shorthandCode] || result.weather;
          const fullWeatherIcon =
            weatherIcons[shorthandCode] || "<i class='fa-solid fa-circle'></i>";

          const weather_display = document.getElementById("status");
          const weather_icon = document.getElementById("icon");
          weather_display.innerText = fullWeather;
          weather_icon.innerHTML = fullWeatherIcon;
        }

        break;
      }
    })
    .catch((error) => console.error(error))
    .finally(() => console.log("The network call has been finalised"));
}
