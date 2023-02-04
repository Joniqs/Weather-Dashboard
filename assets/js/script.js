var searchButton = $('#search-button');
var APIKey = '752b36ab082bfbac8bc47e93de46fdfc';
var daysArray = [];
// iterate 5 times
for (var i = 0; i < 5; i++) {
  // store moment + i in m... moment today, moment tomorrow... for 5 days
  var m = moment().add(i, "d");
  // format all the moments into dd/mm/yyyy
  var x = m.format("DD MM YYYY");
  // push each day into days array
  daysArray.push(x);
}

  searchButton.on('click', function(e){
    e.preventDefault();
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
            day1.push(data[i]);
          }
          // same for tomorrow...
          if (date === daysArray[1]) {
            day2.push(data[i]);
          }
          if (date === daysArray[2]) {
            day3.push(data[i]);
          }
          if (date === daysArray[3]) {
            day4.push(data[i]);
          }
          if (date === daysArray[4]) {
            day5.push(data[i]);
          }
        }
        console.log(averageArray(day1));
        console.log(averageArray(day2));
        console.log(averageArray(day3));
        console.log(averageArray(day4));
        console.log(averageArray(day5));
    });
    
    // Function that sets player score to localStorage
// function pushtolocalStorage(object) {
//   // If localStorage is empty create new localStorage
//   if(localStorage.getItem("score") === null) {
//     // Create an array of objects
//     var forecastArray = [];
//     // Push my object to that array
//     forecastArray.push(object);
//     // Set localStorage to my array
//     localStorage.setItem('score', JSON.stringify(scoreArray));
//     // If it exists
//   } else {
//     // Create an array
//     var forecastArray = [];
//     // Get my localStorage which must be parsed 
//     forecastArray = JSON.parse(localStorage.getItem('score'));
//     // Push my object to newly created array which is a mirror of localStorage
//     scoreArray.push(playerObject);
//     // Push my Array of objects to localStorage
//     localStorage.setItem('score', JSON.stringify(scoreArray));
//   }  
// }

    function averageArray(arr)
        {
          var sumTemp = 0;
          var windSpeed = 0
          var humidity = 0;

          for (var i = 0; i < arr.length; i++)
          {
              sumTemp = sumTemp + arr[i].main.temp;
              humidity += arr[i].main.humidity;
              windSpeed += arr[i].wind.speed;
          }

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
            icon: iconForecast,
            date: dateForecast,
            temp: avgTemp,
            wind: avgWind,
            humidity: avgHumidity
          }
          return forecastObj;
        }
  });