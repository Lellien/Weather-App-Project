// city name display
function changeCityNameHeading(currentCity) {
  let currentCityName = `${currentCity[0]}, ${currentCity[1]}`;
  let cityNameHeading = document.querySelector("h1");
  cityNameHeading.innerHTML = currentCityName;
}

//current date (local)
function showDate(date) {
  let dateDisplay = document.querySelector("#date");
  dateDisplay.innerHTML = date;
}

//current time (local)
function showTime(time) {
  let timeDisplay = document.querySelector("#time");
  timeDisplay.innerHTML = time;
}

// current weather
function showCurrentTemp(temp) {
  let nowTemp = document.querySelector(".weather-main strong");
  nowTemp.innerHTML = temp;
}

//weather condition icon
function showIcon(code, text) {
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${code}@2x.png`
  );
  iconElement.setAttribute("alt", text);
}
function describeWeather(description) {
  let currentDescription = document.querySelector("#weather-description");
  currentDescription.innerHTML = description;
}
//extra info
function showWindDirection(direction) {
  let currentWindDirection = document.querySelector("#wind-direction");
  currentWindDirection.innerHTML = direction;
}
function showWindSpeed(speed) {
  let currentWindSpeed = document.querySelector("#wind-speed");
  currentWindSpeed.innerHTML = `${speed}mph`;
}

function showHumidity(humidity) {
  let currentHumidity = document.querySelector("#humidity");
  currentHumidity.innerHTML = `${humidity}%`;
}

function showVisibility(visibility) {
  let currentVisibility = document.querySelector("#visibility");
  currentVisibility.innerHTML = `${visibility.index}/${visibility.km}km`;
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

//display forecast data
function showForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
      <div class="weather-forecast-day">${formatDay(forecastDay.dt)}</div>
      <img
        src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png"
        alt=""
        class="forecast-icon"
      />
      <div class="weather-forecast-temps">
      <span class="forecast-temp-hi"><span class="temp">${Math.round(
        forecastDay.temp.max
      )}</span>°</span>
      <span class="forecast-temp-lo"><span class="temp">${Math.round(
        forecastDay.temp.min
      )}</span>°</span>
      </div>
      </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function useDayMode() {
  let appBorder = document.querySelector(".weather-app");
  appBorder.classList.remove("night");
  let cityImage = document.querySelector("#city-buildings");
  cityImage.setAttribute("src", "images/city-day.svg");
  let clockStyle = document.querySelector("#time");
  clockStyle.classList.remove("night");
  let tempButton = document.querySelectorAll(".btn-outline-primary");
  tempButton.forEach(function (element) {
    element.classList.remove("night");
  });
  let forecastIcon = document.querySelectorAll("img.forecast-icon");
  forecastIcon.forEach(function (element) {
    element.classList.remove("night");
  });
  let extraInfo = document.querySelectorAll("ul.extra-info span");
  extraInfo.forEach(function (element) {
    element.classList.remove("night");
  });
}

function useNightMode() {
  let appBorder = document.querySelector(".weather-app");
  appBorder.classList.add("night");
  let cityImage = document.querySelector("#city-buildings");
  cityImage.setAttribute("src", "images/city-night.svg");
  let clockStyle = document.querySelector("#time");
  clockStyle.classList.add("night");
  let tempButton = document.querySelectorAll(".btn-outline-primary");
  tempButton.forEach(function (element) {
    element.classList.add("night");
  });
  let forecastIcon = document.querySelectorAll("img.forecast-icon");
  forecastIcon.forEach(function (element) {
    element.classList.add("night");
  });
  let extraInfo = document.querySelectorAll("ul.extra-info span");
  extraInfo.forEach(function (element) {
    element.classList.add("night");
  });
}

function checkDayNight(data) {
  let datetime = data.current.dt * 1000;
  let timezone = data.timezone_offset * 1000;
  let localTime = datetime + timezone;
  let sunrise = data.current.sunrise * 1000;
  let localSunrise = sunrise + timezone;
  let sunset = data.current.sunset * 1000;
  let localSunset = sunset + timezone;
  if (localTime > localSunrise && localTime < localSunset) {
    useDayMode();
  } else {
    useNightMode();
  }
}

//Forecast API call from coordinates of first call
function getForecast(coordinates) {
  let unit = checkUnit();

  let apiKey = "0392c3c6a728319e4bcd5bed20b65b72";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(useData);
  function useData(response) {
    showForecast(response);
    checkDayNight(response.data);
  }
}

// Search engine

function injectData(cityData) {
  changeCityNameHeading([cityData.name, cityData.country]);
  showDate(cityData.datetime.date);
  showTime(cityData.datetime.time);
  showCurrentTemp(cityData.temp);
  describeWeather(cityData.description);
  function showExtraInfo() {
    showWindDirection(cityData.wind.direction);
    showWindSpeed(cityData.wind.speed);
    showHumidity(cityData.humidity);
    showVisibility(cityData.visibility);
  }
  showExtraInfo();
  showIcon(cityData.icon, cityData.description);
}
//format time
function formatTime(timestamp) {
  let currentHours = timestamp.getHours();
  currentHours = currentHours.toString().padStart(2, "0");

  let currentMinutes = timestamp.getMinutes();
  currentMinutes = currentMinutes.toString().padStart(2, "0");

  return `${currentHours}:${currentMinutes}`;
}

//format date

function addDateSuffix(dateValue) {
  let firstDates = [1, 21, 31];
  let secondDates = [2, 22];
  let thirdDates = [3, 23];
  let dateSuffix = "";
  if (firstDates.includes(dateValue)) {
    dateSuffix = "st";
  } else if (secondDates.includes(dateValue)) {
    dateSuffix = "nd";
  } else if (thirdDates.includes(dateValue)) {
    dateSuffix = "rd";
  } else {
    dateSuffix = "th";
  }
  return dateSuffix;
}

function formatDate(date) {
  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = weekDays[date.getDay()];

  let currentDate = date.getDate();
  let dateSuffix = addDateSuffix(currentDate);

  let months = [
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

  let currentMonth = months[date.getMonth()];

  return `${currentDay}, ${currentDate}${dateSuffix} of ${currentMonth}`;
}
function formatCity(data) {
  let localDatetime = new Date(data.dt * 1000 + data.timezone * 1000);
  let localDate = formatDate(localDatetime);
  let localTime = formatTime(localDatetime);
  function calculateWindDirection(deg) {
    let direction = "";
    if ((0 <= deg && deg < 11.25) || (348.75 <= deg && deg <= 360)) {
      direction = "N";
    } else if (11.25 <= deg && deg < 33.75) {
      direction = "NNE";
    } else if (33.75 <= deg && deg < 56.25) {
      direction = "NE";
    } else if (56.25 <= deg && deg < 78.75) {
      direction = "ENE";
    } else if (78.75 <= deg && deg < 101.25) {
      direction = "E";
    } else if (101.25 <= deg && deg < 123.75) {
      direction = "ESE";
    } else if (123.75 <= deg && deg < 146.25) {
      direction = "SE";
    } else if (146.25 <= deg && deg < 168.75) {
      direction = "SSE";
    } else if (168.75 <= deg && deg < 191.25) {
      direction = "S";
    } else if (191.25 <= deg && deg < 213.75) {
      direction = "SSW";
    } else if (213.75 <= deg && deg < 236.25) {
      direction = "SW";
    } else if (236.25 <= deg && deg < 258.75) {
      direction = "WSW";
    } else if (258.75 <= deg && deg < 281.25) {
      direction = "W";
    } else if (281.25 <= deg && deg < 303.75) {
      direction = "WNW";
    } else if (303.75 <= deg && deg < 326.25) {
      direction = "NW";
    } else if (326.25 <= deg && deg < 348.75) {
      direction = "NNW";
    }
    return direction;
  }
  let windDirection = calculateWindDirection(data.wind.deg);

  function calculateVisibilityIndex(meters) {
    let vis = "";
    if (meters < 1000) {
      vis = "VP";
    } else if (meters >= 1000 && meters < 4000) {
      vis = "P";
    } else if (meters >= 4000 && meters < 10000) {
      vis = "M";
    } else if (meters >= 10000 && meters < 20000) {
      vis = "G";
    } else if (meters >= 20000 && meters < 40000) {
      vis = "VG";
    } else if (meters > 40000) {
      vis = "E";
    }
    // Very Poor, Poor, Medium, Good, Very Good, Excellent.
    return vis;
  }
  let visibilityIndex = calculateVisibilityIndex(data.visibility);
  let formattedCity = {
    name: data.name,
    country: data.sys.country,
    datetime: { date: localDate, time: localTime },
    temp: Math.round(data.main.temp),
    humidity: data.main.humidity,
    description: data.weather[0].description,
    wind: {
      direction: windDirection,
      speed: Math.round(data.wind.speed * 2.2369363), //convert to miles
    },
    visibility: {
      km: Math.round(data.visibility / 1000),
      index: visibilityIndex,
    },
    icon: data.weather[0].icon,
  };
  injectData(formattedCity);
}
function checkUnit() {
  let selectedUnit = "";
  if (celsiusButton.checked) {
    selectedUnit = "metric";
  } else if (fahrenheitButton.checked) {
    selectedUnit = "imperial";
  }
  return selectedUnit;
}

function search(cityName) {
  let unit = checkUnit();

  let apiKey = "0392c3c6a728319e4bcd5bed20b65b72";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&appid=${apiKey}`;

  axios.get(apiUrl).then(checkCity);
  function checkCity(response) {
    if (response) {
      formatCity(response.data);
      getForecast(response.data.coord);
    }
  }
}
function getCityName(event) {
  event.preventDefault();
  let citySearchInput = document.querySelector("#city-input");
  search(citySearchInput.value);
}

let searchForm = document.querySelector("form#search-form");
searchForm.addEventListener("submit", getCityName);

//temp °C/°F

function showFahrenheit() {
  let tempValues = document.querySelectorAll(".temp");
  tempValues.forEach(function (element) {
    element.innerHTML = Math.round(element.innerHTML * 1.8 + 32);
  });
}

function showCelsius() {
  let tempValues = document.querySelectorAll(".temp");
  tempValues.forEach(function (element) {
    element.innerHTML = Math.round((element.innerHTML - 32) / 1.8);
  });
}

let celsiusButton = document.querySelector("#celsius-button");
celsiusButton.addEventListener("change", showCelsius);

let fahrenheitButton = document.querySelector("#fahrenheit-button");
fahrenheitButton.addEventListener("change", showFahrenheit);

//current location
function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let unit = checkUnit();

  let apiKey = "0392c3c6a728319e4bcd5bed20b65b72";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;

  axios.get(apiUrl).then(getCurrentCity);

  function getCurrentCity(response) {
    formatCity(response.data);
    getForecast(response.data.coord);
  }
}

function getGeolocation() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", getGeolocation);

search("London");
