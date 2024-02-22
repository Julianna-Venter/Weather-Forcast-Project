
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

export function getLocalTimeAndDate(latitude, longitude) {
  const timezoneApiUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${Math.floor(
    Date.now() / 1000
  )}&key=${"AIzaSyDIAQv0sNyWV3OfQF5EiZI8eDpl1W5QjBo"}`;

  fetch(timezoneApiUrl)
    .then((response) => response.json())
    .then((data) => {
      const timezoneId = data.timeZoneId;



      const localTime = new Date().toLocaleString("en-US", {
        timeZone: timezoneId,
      });



      setDateTime(localTime);
      
    })
    .catch((error) => {
      console.error("Error fetching timezone information:", error);
    });
}

function updateLocalTime(timezoneId) {
  const localTime = new Date().toLocaleString("en-US", {
    timeZone: timezoneId,
  });

  setDateTime(localTime);
}


function setDateTime (localTime) {
  const localTimeDate = new Date(localTime);

      const day = document.getElementById("day");
      const date = document.getElementById("date");
      const time = document.getElementById("time");
      const addZero = (number) => (number < 10 ? "0" + number : number);

      const hours = addZero(localTimeDate.getHours());
      const minutes = addZero(localTimeDate.getMinutes());

      if (!day || !date || !time || !hours || !minutes){
        return;
      }

      day.innerText = days[localTimeDate.getDay()] + ",";
      date.innerText =
        localTimeDate.getDate() +
        " " +
        months[localTimeDate.getMonth()] +
        " " +
        localTimeDate.getFullYear();


      time.innerText = hours + ":" + minutes;
}