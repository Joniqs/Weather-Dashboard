var searchButton = $('#search-button');
var APIKey = '752b36ab082bfbac8bc47e93de46fdfc';


  searchButton.on('click', function(e){
    e.preventDefault();
    
    var inputValue = $('#search-input').val();
    var numberofObjects = 40;
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast/?q=" + inputValue + "&appid=" + APIKey + "&cnt=" + numberofObjects;
    
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
    });
       
  });