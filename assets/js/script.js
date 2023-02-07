var searchButton = $('#search-button');
var APIKey = '752b36ab082bfbac8bc47e93de46fdfc';
//Clear localstorage
localStorage.clear();
var daysArray = [];
// iterate 5 times
for (var i = 0; i < 6; i++) {
  // store moment + i in m... moment today, moment tomorrow... for 6 days
  var m = moment().add(i, "d");
  // format all the moments into dd/mm/yyyy
  var x = m.format("DD MM YYYY");
  // push each day into days array
  daysArray.push(x);
}
  
  searchButton.on('click', function(e){
    e.preventDefault();
    //Arrays that will hold data for each day
    var day0 = []; 
    var day1 = []; 
    var day2 = [];
    var day3 = [];
    var day4 = [];
    var day5 = [];
    //User input value
    var inputValue = $('#search-input').val();
    //We need 40 objects to forecast data
    var numberofObjects = 40;
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast/?q=" + inputValue + "&appid=" + APIKey + '&units=metric' + "&cnt=" + numberofObjects;
    
    //Get API data
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      //Shorten response data for readable code
      var data = response.list;
      //Get data and store it in separate arrays
      for (var i = 0; i < data.length; i++) {
          // Get date and reverse it
          var dateAndTime = data[i].dt_txt;
          var year = dateAndTime.slice(0, 4);
          var month = dateAndTime.slice(5, 7);
          var day = dateAndTime.slice(8, 10);
          var date = day + " " + month + " " + year;
          // Sort data to different arrays based on date
          if (date === daysArray[0]) {
            day0.push(data[i]);
          }
          if (date === daysArray[1]) {
            day1.push(data[i]);
          }
          if (date === daysArray[2]) {
            day2.push(data[i]);
          }
          if (date === daysArray[3]) {
            day3.push(data[i]);
          }
          if (date === daysArray[4]) {
            day4.push(data[i]);
          }
          if (date === daysArray[5]) {
            day5.push(data[i]);
          }

        }
        //If input Value (city) does not exist in localstorage
        if(!localStorage.getItem(inputValue)) {
          //Create array where each element holds data for that day
          var allDays = [day0, day1, day2, day3, day4, day5]; 
          //Loop through it count temp, wind speed, humidity, get city name and icon
          for(var i = 0; i < allDays.length; i++) {
            averageArray(allDays[i]);
            // And push it to local storage for key that is equal to user input (city)
            pushtolocalStorage(averageArray(allDays[i]));
          }
          //Delete children of div's that are responsible for displaying our weather dashoboard
          clearChildren();
          //Create and display card for current date
          currentWeather();
          //Create and display cards for the rest
          forecastWeather();

          //Create a button that will show history weather data
          var button = $("<button>").text(inputValue).addClass("btn btn-success");;
          $('#history').append(button);

          $(button).on('click', function () {
            if(localStorage.getItem(inputValue) !== null) {
              clearChildren();
              currentWeather();
              forecastWeather();
            }
          })
        }
    });
    
      // Function that sets player score to localStorage
      function pushtolocalStorage(object) {
        var inputValue = $('#search-input').val();
        // If localStorage is empty create new localStorage
        if(localStorage.getItem(inputValue) === null) {
          // Create an array of objects
          var forecastArray = [];
          // Push my object to that array
          forecastArray.push(object);
          // Set localStorage to my array
          localStorage.setItem(inputValue, JSON.stringify(forecastArray));
          // If it exists
        } else {
          // Create an array
          var forecastArray = [];
          // Get my localStorage which must be parsed 
          forecastArray = JSON.parse(localStorage.getItem(inputValue));
          // Push my object to newly created array which is a mirror of localStorage
          forecastArray.push(object);
          // Push my Array of objects to localStorage
          localStorage.setItem(inputValue, JSON.stringify(forecastArray));
        }  
      }

      //Function that delete's children for div's where we display weather data
      function clearChildren() {
        $("#today").empty();
        $("#forecast").empty();
      }

      //Function that will Capitalize first letter of a string
      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      //Get weather data and display data for current day
      function currentWeather() {
      var forecast = JSON.parse(localStorage.getItem(inputValue));
        var todayDiv = 
          `<div class="card" style="width: 64rem;">
            <div class="card-body">
              <h3 class="card-title">${
                capitalizeFirstLetter(forecast[0].city) + ` (` + forecast[0].date + `)`
              }</h3><img src='http://openweathermap.org/img/wn/${forecast[0].icon}@2x.png'>
              <h5>Temp: ${forecast[0].temp} </h5>
              <h5>Wind: ${forecast[0].wind} </h5>
              <h5>Humidity: ${forecast[0].humidity} </h5>
            </div>
          </div>`;
        $('#today').append(todayDiv);
      }

      //Get weather data and loop through the rest of it to generate forecast data
      function forecastWeather() {
        var forecast = JSON.parse(localStorage.getItem(inputValue));
          for(var i = 1; i < forecast.length; i++) {
            var forecastDiv = 
            `<div class="card" style="width: 12rem;">
              <div class="card-body">
                <h5 class="card-title">${
                  forecast[i].date
                }</h5><img src='http://openweathermap.org/img/wn/${forecast[i].icon}@2x.png'>
                <h6>Temp: ${forecast[i].temp} </h6>
                <h6>Wind: ${forecast[i].wind} </h6>
                <h6>Humidity: ${forecast[i].humidity} </h6>
              </div>
            </div>`;
            $('#forecast').append(forecastDiv);
        }
      }

      //Function that based on sorted data, count avg temp, wind speed, humidity, adds icon and city name
      function averageArray(arr) {
        var sumTemp = 0;
        var windSpeed = 0
        var humidity = 0;

        for (var i = 0; i < arr.length; i++) {
            sumTemp = sumTemp + arr[i].main.temp;
            humidity += arr[i].main.humidity;
            windSpeed += arr[i].wind.speed;
        }

        //Get user input 
        var city = $('#search-input').val();
        //Get icon
        var iconForecast = arr[0].weather[0].icon;
        //Get date
        var dateAndTime = arr[0].dt_txt;
        //Reverse that date
        var year = dateAndTime.slice(0, 4);
        var month = dateAndTime.slice(5, 7);
        var day = dateAndTime.slice(8, 10);
        var dateForecast = day + "/" + month + "/" + year;

        //Count average temp, wind speed, humidity
        var avgTemp = (sumTemp / arr.length).toFixed(2) + "°C";
        var avgWind = (windSpeed / arr.length).toFixed(2) + "Kph";
        var avgHumidity = (humidity / arr.length).toFixed(2) + "%";

        //Create an object that hold counted data
        var forecastObj = {
          city: city,
          icon: iconForecast,
          date: dateForecast,
          temp: avgTemp,
          wind: avgWind,
          humidity: avgHumidity
        }
        //Return that object so we can push it to local storage
        return forecastObj;
      }
  });