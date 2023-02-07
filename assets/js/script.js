var searchButton = $('#search-button');
var APIKey = '752b36ab082bfbac8bc47e93de46fdfc';
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
    var day0 = [];
    var day1 = []; /*TODAY*/
    var day2 = []; /*TOMORROW ....*/
    var day3 = [];
    var day4 = [];
    var day5 = [];
    var inputValue = $('#search-input').val();
    //var inputValue = $('#search-input').val();
    var numberofObjects = 40;
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast/?q=" + inputValue + "&appid=" + APIKey + '&units=metric' + "&cnt=" + numberofObjects;
    //var inputValue = $('#search-input').val();
    
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      var data = response.list;
      console.log(data);
      // GET THE DATA AND STORE IT IN THE CORRECT DAY
      // -----------------------------------------
      // iterate through the data list from the api
      for (var i = 0; i < data.length; i++) {
          // GET THE DATE DD MM YYYY ----------
          var dateAndTime = data[i].dt_txt;
          var year = dateAndTime.slice(0, 4);
          var month = dateAndTime.slice(5, 7);
          var day = dateAndTime.slice(8, 10);
          var date = day + " " + month + " " + year;
          // console.log(date)
          // -------------------------------------
          // IF THE DATE === TODAY
          if (date === daysArray[0]) {
            // push the info from the api into the TODAY array
            day0.push(data[i]);
          }
          // same for tomorrow...
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
        if(!localStorage.getItem(inputValue)) {
          var allDays = [day0, day1, day2, day3, day4, day5]; 
          for(var i = 0; i < allDays.length; i++) {
            averageArray(allDays[i]);
            pushtolocalStorage(averageArray(allDays[i]));
          }
          clearChildren();
          currentWeather();
          forecastWeather();

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

      function clearChildren() {
        $("#today").empty();
        $("#forecast").empty();
      }

      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

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

      function averageArray(arr) {
        var sumTemp = 0;
        var windSpeed = 0
        var humidity = 0;

        for (var i = 0; i < arr.length; i++) {
            sumTemp = sumTemp + arr[i].main.temp;
            humidity += arr[i].main.humidity;
            windSpeed += arr[i].wind.speed;
        }

        var city = $('#search-input').val();
        var iconForecast = arr[0].weather[0].icon;
        var dateAndTime = arr[0].dt_txt;
        var year = dateAndTime.slice(0, 4);
        var month = dateAndTime.slice(5, 7);
        var day = dateAndTime.slice(8, 10);
        var dateForecast = day + "/" + month + "/" + year;

        var avgTemp = (sumTemp / arr.length).toFixed(2) + "°C";
        var avgWind = (windSpeed / arr.length).toFixed(2) + "Kph";
        var avgHumidity = (humidity / arr.length).toFixed(2) + "%";

        var forecastObj = {
          city: city,
          icon: iconForecast,
          date: dateForecast,
          temp: avgTemp,
          wind: avgWind,
          humidity: avgHumidity
        }
        return forecastObj;
      }
  });