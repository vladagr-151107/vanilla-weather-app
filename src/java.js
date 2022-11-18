function showTemperature(response) {
    let temperatureElement = document.querySelector("#temperature")
    temperatureElement.innerHTML = Math.round(response.data.temperature.current);
    let cityElement = document.querySelector("#city")
    cityElement.innerHTML = response.data.city;
    let descriptionElement = document.querySelector("#description");
    descriptionElement.innerHTML = response.data.condition.description;
    let windElement = document.querySelector("#wind");
    windElement.innerHTML = Math.round(response.data.wind.speed);
}
let apiKey = "e43d0522c6a2b491f8bte6b227o4172b";
let apiUrl =
    `https://api.shecodes.io/weather/v1/current?query=Odesa&key=${apiKey}&units=metric`;
axios.get(apiUrl).then(showTemperature);