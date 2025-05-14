let currentCity = "Odesa";
let celsiusTemperature = null;
let forecastData = null;
function updateCurrentTime() {
  let now = new Date();
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let currentDay = now.getDate();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let month = months[now.getMonth()];
  let day = days[now.getDay()];

  let dateElement = document.querySelector("#date");
  if (dateElement) {
    dateElement.innerHTML = `${day}, ${month} ${currentDay} ${hours}:${minutes}`;
  }
}
setInterval(updateCurrentTime, 1000);
updateCurrentTime();
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let currentDay = date.getDate();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
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
  celsiusTemperature = response.data.temperature.current;
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

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);

  celsiusTemperature = response.data.temperature.current;
  currentCity = response.data.city;
  saveToHistory(currentCity);
  getForecast(response.data.coordinates);
}
function convertForecastToFahrenheit(){
  let maxTemps = document.querySelectorAll(".forecast-temp-max");
  let minTemps = document.querySelectorAll(".forecast-temp-min");
  maxTemps.forEach(function (span) {
    let celsius = parseFloat(span.getAttribute("data-celsius"));
    let fahrenheit = (celsius * 9) / 5 + 32;
    span.innerHTML = `${Math.round(fahrenheit)}°F`;
  });

  minTemps.forEach(function (span) {
    let celsius = parseFloat(span.getAttribute("data-celsius"));
    let fahrenheit = (celsius * 9) / 5 + 32;
    span.innerHTML = `${Math.round(fahrenheit)}°F`;
  });
}
function convertForecastToCelsius(){
  let maxTemps = document.querySelectorAll(".forecast-temp-max");
  let minTemps = document.querySelectorAll(".forecast-temp-min");

  maxTemps.forEach(function (span) {
    let celsius = parseFloat(span.getAttribute("data-celsius"));
    span.innerHTML = `${Math.round(celsius)}°C`;
  });

  minTemps.forEach(function (span) {
    let celsius = parseFloat(span.getAttribute("data-celsius"));
    span.innerHTML = `${Math.round(celsius)}°C`;
  });
}
function displayFahrenheitTemperature(event){
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let fahrenheitTemperature = (celsiusTemperature * 9)/ 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);

  displayForecast("imperial");

  document.querySelector("#celsius-link").classList.remove("active");
  document.querySelector("#fahrenheit-link").classList.add("active");
}

function displayCelsiusTemperature(event){
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  displayForecast("metric");

  document.querySelector("#fahrenheit-link").classList.remove("active");
  document.querySelector("#celsius-link").classList.add("active");
}

function getForecast(coordinates) {
  let apiKey = "e43d0522c6a2b491f8bte6b227o4172b";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(function(response){
    forecastData = response.data.daily;
    displayForecast();
  });
}
function displayForecast(units = "metric") {
  let forecast = forecastData;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      let maxTemp = forecastDay.temperature.maximum;
      let minTemp = forecastDay.temperature.minimum;
      if(units === "imperial"){
        maxTemp = (maxTemp * 9) / 5 + 32;
        minTemp = (minTemp * 9) / 5 + 32;
      }
      forecastHTML =
        forecastHTML +
        `<div class="col-lg-2 col-4"> 
                <div class="forecast-day">${formatDay(forecastDay.time)}</div>
                <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                  forecastDay.condition.icon
                }.png" alt="" width="80"/>
               <div class="forecast-temperatures"> 
               <span class="forecast-temp-max">${Math.round(
                 maxTemp
               )}${units === "imperial" ? " °F" : " °C"}</span> / 
               <span class="forecast-temp-min">${Math.round(
                 minTemp
               )}${units === "imperial" ? " °F" : " °C"}</span>
                </div>
              </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  currentCity = cityInputElement.value;
  if(currentCity !== ""){
    localStorage.setItem("lastCity", currentCity);
    saveToHistory(currentCity);
    search(currentCity);
    cityInputElement.value = "";
  }
}

function searchLocation(position) {
  let apiKey = "e43d0522c6a2b491f8bte6b227o4172b";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${position.coords.longitude}&lat=${position.coords.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(function(response){
    let cityName = response.data.city;
    localStorage.setItem("lastCity", cityName);
    saveToHistory(cityName);
    showTemperature(response);
  });
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", getCurrentLocation);
setInterval(function(){
  search(currentCity);
}, 60000);
function saveToHistory(city){
  city = city.trim();
  if(!city) return;

  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  history = history.filter(item => item.toLowerCase() !==city.toLowerCase());
  history.unshift(city);
  if(history.length > 5){
    history.pop();
  }
  localStorage.setItem("searchHistory", JSON.stringify(history));
  displayHistory();
}
function displayHistory() {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  let historyElement = document.querySelector("#search-history");

  if (history.length === 0) {
    historyElement.innerHTML = "";
    return;
  }

  let html = "";

  history.forEach(function(city) {
    html += `<div class="history-item" data-city="${city}">${city}</div>`;
  });

  html += "</ul>";

  historyElement.innerHTML = html;

  document.querySelectorAll(".history-item").forEach(function(link){
    link.addEventListener("click", function(event){
      event.preventDefault();
      let city = this.getAttribute("data-city");
      localStorage.setItem("lastCity", city);
      saveToHistory(city);
      search(city);
      document.querySelector("#search-history").style.display = "none";
    })
  })
}
let cityInputElement = document.querySelector("#city-input");

cityInputElement.addEventListener("focus", function(){
  displayHistory();
  document.querySelector("#search-history").style.display = "block";
});
cityInputElement.addEventListener("input", function(){
  displayHistory();
   document.querySelector("#search-history").style.display = "block";
});
document.addEventListener("click", function(event){
  if(!event.target.closest("#city-input") && !event.target.closest("#search-history")){
    document.querySelector("#search-history").style.display = "none";
  }
})
let savedCity = localStorage.getItem("lastCity");
console.log(savedCity);
if (savedCity && savedCity.trim() !== "") {
  currentCity = savedCity;
  search(savedCity);
} else {
  currentCity = "Odesa";
  search("Odesa");
}
document.addEventListener("DOMContentLoaded", function(){
  const toggleBtn = document.querySelector("#toggle-theme");
function applyTheme(theme){
  if(theme === "dark"){
    document.body.classList.add("dark-mode");
    toggleBtn.innerText = "Light mode";
  } else{
    document.body.classList.remove("dark-mode");
    toggleBtn.innerText = "Dark mode";
  }
}
  let savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
  toggleBtn.addEventListener("click", function(){
    let currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    let newTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  })
});