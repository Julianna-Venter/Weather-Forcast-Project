const display = document.getElementById("display-container");
const load_display = document.getElementById("load-container");

function populateDataHourly(lat, lon) {
  const summaries = document.getElementById("summaries_hourly");
  if (!summaries){
    return;
  }
  summaries.innerHTML = "";
  let hourlytext = "";
  const hourlyPromise = fetch(
    `http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=astro&output=json`
  )
    .then((response) => response.json())
    .then((jsonresponse) => {
      if (!jsonresponse?.dataseries) {
        throw new Error("Test catch?");
      }

      const results = jsonresponse.dataseries;
      let result = results[0];

      if (result) {
        let wind = "";
        if (result?.wind10m?.direction && result?.wind10m?.speed) {
          wind += `${result.wind10m.speed}km/h ${result.wind10m.direction}`;
          const wind_display = document.getElementById("wind");
          if (wind_display){

            wind_display.innerText = wind;
          }
        }

        let humidity = "";
        if (result?.rh2m) {
          humidity += `${result.rh2m}%`;
          const humid = document.getElementById("humidity");
          if (humid){
          humid.innerText = humidity;
          }
        }

        let temp = "";
        if (result?.temp2m) {
          temp += `${result.temp2m}ºC`;
          const curr_temp = document.getElementById("curr_temp");
          if (curr_temp){

          curr_temp.innerText = temp;
          }
        }

        let precip = "";
        if (result?.temp2m) {
          precip += `${result.prec_type}`;
          const curr_precip = document.getElementById("precip");
          if (curr_precip){

          curr_precip.innerText = precip;
          }
        }
      }

      for (let i = 0; i < results.length; i++) {
        const item = results[i];

        let timeOfDay = "";
        let hourlyWeatherIcon = "";
        let hourlyTemp = "";

        if (item?.timepoint) {
          const currentDate = new Date();
          currentDate.setHours(currentDate.getHours() + item.timepoint);
          timeOfDay = currentDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        if (item?.cloudcover && item?.prec_type) {
          let verdict = "";

          if (item.prec_type === "rain") {
            verdict = "lightrain";
          } else {
            if (item.cloudcover < 2) {
              verdict = "clear";
            } else if (item.cloudcover >= 2 && item.cloudcover < 6) {
              verdict = "pcloudy";
            } else if (item.cloudcover >= 6 && item.cloudcover < 8) {
              verdict = "cloudy";
            } else if (item.cloudcover >= 8) {
              verdict = "mcloudy";
            }
          }

          hourlyWeatherIcon =
            weatherIcons[verdict] || "<i class='fa-solid fa-circle'></i>";
        }

        if (item?.temp2m) {
          hourlyTemp += `${item.temp2m}ºC`;
        }

        hourlytext += `<div class='item'> <label>${timeOfDay}</label>${hourlyWeatherIcon}<label class='special'>${hourlyTemp}</label> </div>`;

        if (i > 10) {
          break;
        }
      }

      summaries.innerHTML = hourlytext;
    })
    .catch((error) => console.error(error));

  return hourlyPromise;
}

const weatherMappings = {
  ts: "Thunder Showers",
  pcloudy: "Partly Cloudy",
  mcloudy: "Mostly Cloudy",
  cloudy: "Cloudy",
  ishower: "Isolated Showers",
  lightrain: "Light Rain",
  clear: "Clear",
  oshower: "Occasional Showers",
  humid: "Humid",
  lightsnow: "Light Snow",
  rain: "Rain",
  snow: "Snow",
  rainsnow: "Rain & Snow",
};

const weatherIcons = {
  ts: "<i class='fa-solid fa-cloud-bolt'></i>",
  pcloudy: "<i class='fa-solid fa-cloud-sun'></i>",
  cloudy: "<i class='fa-solid fa-cloud'></i>",
  mcloudy: "<i class='fa-solid fa-cloud-sun'></i>",
  ishower: "<i class='fa-solid fa-cloud-showers-heavy'></i>",
  lightrain: "<i class='fa-solid fa-cloud-rain'></i>",
  oshower: "<i class='fa-solid fa-cloud-showers-heavy'></i>",
  clear: "<i class='fa-solid fa-sun'></i>",
  humid: "<i class='fa-solid fa-hand-holding-droplet'></i>",
  lightsnow: "<i class='fa-solid fa-snowflake'></i>",
  rain: "<i class='fa-solid fa-cloud-rain'></i>",
  snow: "<i class='fa-solid fa-snowflake'></i>",
  rainsnow: "<i class='fa-solid fa-cloud-showers-water'></i>",
};

function populateDataDaily(lat, lon) {
  const summariesD = document.getElementById("summaries");
  if (!summariesD) {
    return;
  }
  summariesD.innerHTML = "";
  let dailytext = "";
  const dailyPromise = fetch(
    `http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`
  )
    .then((response) => response.json())
    .then((jsonresponse) => {
      if (!jsonresponse?.dataseries) {
        throw new Error("Test catch?");
      }
      const results = jsonresponse.dataseries;
      let result = results[0];
      if (result) {
        let min = "";
        let max = "";
        if (result?.temp2m?.min && result?.temp2m?.max) {
          min += `${result.temp2m.min}ºC`;
          max += `${result.temp2m.max}ºC`;
          const min_display = document.getElementById("low");
          const max_display = document.getElementById("high");
          if (!min_display || !max_display) {
            return;
          }
          min_display.innerText = min;
          max_display.innerText = max;
        }
        if (result?.weather) {
          const shorthandCode = result.weather.toLowerCase();
          const fullWeather = weatherMappings[shorthandCode] || result.weather;
          const fullWeatherIcon =
            weatherIcons[shorthandCode] || "<i class='fa-solid fa-circle'></i>";
          const weather_display = document.getElementById("status");
          const weather_icon = document.getElementById("icon");
          if (!weather_display || !weather_icon) {
            return;
          }
          weather_display.innerText = fullWeather;
          weather_icon.innerHTML = fullWeatherIcon;
        }
      }

      for (let i = 1; i < results.length; i++) {
        const item = results[i];
        let dayOfWeek = "";
        let fullWeatherIcon = "";
        let max = "";
        if (item?.date) {
          const dateString = `${item.date}`;
          const year = parseInt(dateString.substr(0, 4), 10);
          const month = parseInt(dateString.substr(4, 2), 10) - 1;
          const day = parseInt(dateString.substr(6, 2), 10);
          const dateObject = new Date(year, month, day);
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          dayOfWeek = days[dateObject.getDay()];
        }
        if (item?.weather) {
          const shorthandCode = item.weather.toLowerCase();
          fullWeatherIcon =
            weatherIcons[shorthandCode] || "<i class='fa-solid fa-circle'></i>";
        }
        if (item?.temp2m?.max) {
          max += `${item.temp2m.max}ºC`;
        } else {
          max += "0ºC";
        }
        dailytext += `<div class='item'> <label>${dayOfWeek}</label>${fullWeatherIcon}<label class='special'>${max}</label> </div>`;
      }

      summariesD.innerHTML = dailytext;
    })
    .catch((error) => console.error(error));

  return dailyPromise;
}

export function main(lat, lon) {
  Promise.all([populateDataHourly(lat, lon), populateDataDaily(lat, lon)])
    .then(() => {
      if (!display || !load_display){
        return;
      }
      load_display.style.display = "none";
      display.style.display = "flex";
    })
    .catch((error) => console.error(error));
}
