    //Define HTML Elements//

var searchBar = document.querySelector("#search-bar");
var searchForm = document.querySelector("#search-form");
var submitEl = document.querySelector("#submit");
var recentList = document.querySelector("#recent-searches");
var weatherToday = document.querySelector("#weather-today");
var weatherWeek = document.querySelector("#weather-week");
    
    //Empty Variables//
    var recentSearches = [];
    var geoArray = [];
    var weatherArray = [];
    var cityName = [];
    var cityDetials = [];

    //Geocoding API//
function getCity(cityName) {
    var geocodingUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=1889c56a9f497443e1fbbe7218d7104c";
    fetch(geocodingUrl)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
        var geoArray = data;
        var lat = geoArray[0].lat;
        var lon = geoArray[0].lon;
        
        console.log(lat);
        console.log(lon);
        console.log(geoArray);

    //Open Weather API//
        var openWeatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=1889c56a9f497443e1fbbe7218d7104c";
        console.log(openWeatherURL);
        fetch(openWeatherURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var weatherArray = data;
            console.log(weatherArray);
            printWeather();

    //Print Search Results//
function printWeather () {
    var currentTemp = document.createElement("p")
    var currentWindSpd = document.createElement("p")
    var currentHumidity = document.createElement("p")
    var currentUV = document.createElement("p")
    currentTemp.textContent = "Temp: " + weatherArray.current.temp;
    currentWindSpd.textContent = "Wind Speed: " + weatherArray.current.wind_speed;
    currentHumidity.textContent = "Humidity: " + weatherArray.current.humidity;
    currentUV.textContent = "UV: " + weatherArray.current.uvi;
    weatherToday.append(cityName);
    weatherToday.appendChild(currentTemp);
    weatherToday.appendChild(currentWindSpd);
    weatherToday.appendChild(currentHumidity);
    weatherToday.appendChild(currentUV);

    //For The Week//

    var tomorrowTemp = document.createElement("p")
    var tomorrowWindSpd = document.createElement("p")
    var tomorrowHumidity = document.createElement("p")
    var tomorrowUV = document.createElement("p")
    tomorrowTemp.textContent = "Temp: " + weatherArray.daily[0].temp.day;
    tomorrowWindSpd.textContent = "Wind Speed: " + weatherArray.daily[0].wind_speed;
    tomorrowHumidity.textContent = "Humidity: " + weatherArray.daily[0].humidity;
    tomorrowUV.textContent = "UV: " + weatherArray.daily[0].uvi;
    weatherWeek.append(cityName);
    weatherWeek.appendChild(tomorrowTemp);
    weatherWeek.appendChild(tomorrowWindSpd);
    weatherWeek.appendChild(tomorrowHumidity);
    weatherWeek.appendChild(tomorrowUV);

        }})
    })
}

    // Search Handler// 
recentList.addEventListener("click", function(event) {
        event.preventDefault()
var cityName = event.target.textContent;
        getCity(cityName);
    })
submitEl.addEventListener("click", function(event) {
    event.preventDefault();

var cityName = searchBar.value.trim();
var historyCount = localStorage.getItem("storedCount");

    getCity(cityName);

    //Save To Local Storage//
    if (historyCount === null) {
        historyCount = 1
    }
    else {
        historyCount = localStorage.getItem("storedCount");
    }

localStorage.setItem("city" + historyCount, JSON.stringify(cityName));

    if (historyCount < 3) {
        historyCount++
    }
    else {
        historyCount = 1
    }

localStorage.setItem("storedCount", historyCount);
});


    //Load Search History//
function listHistory () {
    recentList.innerHTML = "";

    if (localStorage.getItem("storedCount") === null) {
        return;
    }

    for (var i = 0; i < recentSearches.length; i++) {
      var recentCity = recentSearches[i];
      var li = document.createElement("button");
      li.textContent = recentCity;
      li.setAttribute("data-index", i);
      recentList.appendChild(li);
    }
}

function getHistory () {
    var searchHistory = [
        JSON.parse(localStorage.getItem("city1")),
        JSON.parse(localStorage.getItem("city2")),
        JSON.parse(localStorage.getItem("city3")),
    ]
    
    if (searchHistory !== null) {
        recentSearches = searchHistory
    }

    listHistory();
}

    //On Page Load//
getHistory();
