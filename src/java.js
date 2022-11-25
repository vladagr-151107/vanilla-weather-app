function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  let currentDay = date.getDate();
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
 let months = [ "Dec", "Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
  let month = months[date.getMonth()];
  let day = days[date.getDay()];
  return `${day}, ${month} ${currentDay} ${hours}:${minutes}`;
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let currentDay = date.getDate();
   let months = [
     "Dec",
     "Jan",
     "Feb",
     "Mar",
     "Apr",
     "Jun",
     "Jul",
     "Aug",
     "Sep",
     "Oct",
     "Nov",
   ];
  let month = months[date.getMonth()];
  return `${currentDay} ${month}`;
}
function search(city) {
  let apiKey = "e43d0522c6a2b491f8bte6b227o4172b";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}
function showTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(response.data.temperature.current);
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.city;
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.condition.description;
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.temperature.humidity;
  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);
  celsiusTemperature = response.data.temperature.current;
  getForecast(response.data.coordinates);
}
function getForecast(coordinates) {
  let apiKey = "e43d0522c6a2b491f8bte6b227o4172b";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
search("Odesa");
function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2"> 
                <div class="forecast-day">${formatDay(forecastDay.time)}</div>
                <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                  forecastDay.condition.icon
                }.png" alt="" width="80"/>
               <div class="forecast-temperatures"> 
               <span class="forecast-temp-max">${Math.round(
                 forecastDay.temperature.maximum
               )}°C</span> / 
               <span class="forecast-temp-min">${Math.round(
                 forecastDay.temperature.minimum
               )}°C</span>
                </div>
              </div>`;
    }
    });
    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
};
function searchLocation(position) {
  let apiKey = "e43d0522c6a2b491f8bte6b227o4172b";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${position.coords.longitude}&lat=${position.coords.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", getCurrentLocation);