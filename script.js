const apiKey = "6ce0eefbe4fecf6b7b2c4623087687fc";
const input = document.querySelector("#searchInput");
const submit = document.querySelector("#searchButton");
const loc = document.querySelector("#location");
const temp = document.querySelector("#temp");
const type = document.querySelector("#type")
const weatherIcon = document.querySelector("#weatherIcon");
const feels_like = document.querySelector("#feels");
const maximum = document.querySelector("#max");
const minimum = document.querySelector("#min");
const wind = document.querySelector("#wind");
const humidity = document.querySelector("#humidity");
const pressure = document.querySelector("#pressure");
const sunriseEl = document.querySelector("#sunrise");
const sunsetEl = document.querySelector("#sunset");
const dayLengthEl = document.querySelector("#dayLength");
const visibilityEl = document.querySelector("#visibility");
const cloudinessEl = document.querySelector("#cloudiness");
const pageContent = document.querySelector("#pageContent");

submit.addEventListener("click", () => {
  const cityvalue = input.value;
  // Reset animation
  pageContent.classList.remove("fade-in");
  pageContent.style.opacity = "0";

  setTimeout(() => {
    pageContent.classList.add("fade-in");
  }, 100);
  getWeatherData(cityvalue);
})

async function getWeatherData(cityvalue) {
  try {
    const reponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityvalue}&appid=${apiKey}&units=metric`);
    if (!reponse.ok) {
      throw new Error("Neteork response is not okay!")
    }
    const data = await reponse.json();

    loc.innerHTML = `${data.name}, ${data.sys.country}`;
    temp.innerHTML = `${Math.floor(data.main.temp)} °C`;
    type.innerHTML = data.weather[0].main;
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description || "Weather icon";
    feels_like.innerHTML = `Feels Like: ${Math.floor(data.main.feels_like)} °C`;
    maximum.innerHTML = `Day Max : ${Math.floor(data.main.temp_max)} °C`;
    minimum.innerHTML = `Day Min :${Math.floor(data.main.temp_min)} °C`
    dayLengthEl.innerHTML = `Day Length: ${calculateDayLength(data.sys.sunrise, data.sys.sunset)}`;
    visibilityEl.innerHTML = `Visibility: ${formatVisibility(data.visibility)}`;
    wind.innerHTML = `${(data.wind.speed * 2.237).toFixed(1)} mph, ${getWindDirection(data.wind.deg)}`;
    sunriseEl.innerHTML = `Sunrise: ${formatTime(data.sys.sunrise, data.timezone)}`;
    sunsetEl.innerHTML = `Sunset: ${formatTime(data.sys.sunset, data.timezone)}`;
    cloudinessEl.innerHTML = `Cloudiness: ${data.clouds.all}%`;
    humidity.innerHTML = `Humidity: ${data.main.humidity}%`;
    pressure.innerHTML = `Pressure: ${data.main.pressure} hPa`;
    input.value = ""
  } catch (err) {
    console.error("Error:", err.message);
    loc.innerHTML = "Could not fetch weather data";
    temp.innerHTML = "";
    input.value = ""
  }
}
function formatTime(timestamp, timezoneOffset) {
  if (!timestamp || isNaN(timestamp) || isNaN(timezoneOffset)) {
    console.error("Invalid input:", { timestamp, timezoneOffset });
    return "Invalid time";
  }
  const localDate = new Date((timestamp + timezoneOffset) * 1000);
  return localDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC"
  });
}
function calculateDayLength(sunrise, sunset) {
  const dayLengthSeconds = sunset - sunrise;
  const hours = Math.floor(dayLengthSeconds / 3600);
  const minutes = Math.floor((dayLengthSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function formatVisibility(meters) {
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

function getWindDirection(deg) {
  const directions = [
    "North", "North-Northeast", "Northeast", "East-Northeast",
    "East", "East-Southeast", "Southeast", "South-Southeast",
    "South", "South-Southwest", "Southwest", "West-Southwest",
    "West", "West-Northwest", "Northwest", "North-Northwest"
  ];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}
