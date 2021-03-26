let input = $("#search-input")[0];
const apikey = "5b88f5dd40c49d3c791f09158ad429c0";
let city = "";
let recentCities = JSON.parse(localStorage.getItem("cities"));
let cityRecent = "";
let isSuccess = false;

//function to display current weather
function getCurrentWeather() {
    var requestUrl = 'http://api.openweathermap.org/data/2.5/weather';
    //check user clicked on city from the list 
    if(!cityRecent == ""){
        city = cityRecent;
        //else get value from input box
    }else{
        city = input.value;
    }
    //check if value is empty, if yes, alert will pop up
    if (city == "") {
        alert('You need input value for search!');
        return;
      }
      //making request to url with query param containing city and apikey
    fetch(requestUrl + "?q="+city+"&appid="+apikey)
      .then(function (response) {
          //if request is not successfull alert will pop up
          if(response.status != 200){
              alert("Search failed. Make sure you enter valid city");
              //variable to check if request was succesful
              isSuccess =false;
              return;
          }else{
              isSuccess = true;
          }
        return response.json();
      })
      .then(function (data) {
          //calling methods to display current weather and uv index
        displayCurrentWeather(data);
        displayUV(data);
        //calling method to store cities list to the local storage
        storeCities();
         //check if request was successful, call method to get forecast
        if(isSuccess){
            getForecastData();
        }
      });
     
  }

  //method to display information on current weather taking one parameter as a json object from response
function displayCurrentWeather(info){
    $("#city").text("City: " + info.name);
    let tempKelvin = info.main.temp;
    //math formula to switch from kelvin to F
    let tempF = Math.round((tempKelvin - 273.15)*9/5 + 32);
    $("#temperature").text("Temperature: " + tempF + "F");
    $("#humidity").text("Humidity: " + info.main.humidity + "%");
    $("#wind-speed").text("Wind: " + info.wind.speed );
}
//method to display UV index - need to make additional request to get UV index.
//it takes one parameter - json object that comes from first request - needed to get lon and lat values for given city
function displayUV(info){
    let url="http://api.openweathermap.org/data/2.5/uvi";
    //retrieving lat and lon values from json object
    let lat = info.coord.lat;
    let lon = info.coord.lon;
    let uv;
    fetch(url + "?lat=" + lat + "&lon=" + lon + "&appid=" + apikey)
        .then(function (response){
            return response.json();
        })
        .then(function(data){
            //storing UV index into variable
            uv = data.value;
            $("#uv-index").addClass("d-inline");
            //adding background color depending on what index value is
            if(uv <= 2.5){
                $("#uv-index-text").text(uv).css("background-color", "green");
            }else if(uv > 2.5 && uv <= 5.5){
                $("#uv-index-text").text(uv).css("background-color", "yellow");
            }else{
                $("#uv-index-text").text(uv).css("background-color", "red");
            }
        })
    
}
  $("button").on('click', getCurrentWeather);
  //calling method to display recentCities from search
  displayCities();

  //method to get forecast data
  function getForecastData(info){
    let url = "http://api.openweathermap.org/data/2.5/forecast?"
    fetch(url + "q=" + city + "&appid=" + apikey + "&units=imperial")
        .then(function (response){
            return response.json();
        })
        .then(function(data){
            //looping through 5 days forecase display info to 5 cards on html
            for(let i = 0; i < 5; i++){
                //assigning values to card elements
                let tempDate =  $("h5[data-index='weather-date-"+(i+1)+"']");
                tempDate.text(data.list[i*8].dt_txt.split(' ')[0]);
                let tempIcon = $("img[data-index='weather-icon-"+(i+1)+"']");
                tempIcon.attr('src', "http://openweathermap.org/img/w/"+data.list[i*8].weather[0].icon+".png");
                let tempTemp = $("p[data-index='weather-temp-"+(i+1)+"']");
                tempTemp.text("Temp: " + data.list[i*8].main.temp + "F");
                let tempHumid = $("p[data-index='weather-humid-"+(i+1)+"']");
                tempHumid.text("Humidity: " + data.list[i*8].main.humidity + "%");
            }
        })
        //displaying all cards
        $("#hidden-forecast-area").show();
  }

  //method to store array of cities to local storage
function storeCities(){
    //first check if recentCities array is null - it comes from localstorage
    if(recentCities == null){
        //if null, we create an empty array
        recentCities = [];
    }
    //looping through array to check if array alredy contains city
    for(let i = 0; i < recentCities.length; i++){
        if(city.toLowerCase() == recentCities[i].toLowerCase()){
            //if contains - exit method
            return;
        }
    }
    //check if array has length 5, if yes - shift it
    if(recentCities.length === 5){
        recentCities.shift();
    }
    //store city to array and then store it to local storage
    recentCities.push(city);
    localStorage.setItem("cities", JSON.stringify(recentCities));
}

//method to display cities on the list
function displayCities(){
    //if array that comes from local storage is empty - exit the method
    if(recentCities == null){
        return;
    }
    //creating list elements with data-value attributes so that we can use them when clicking
    for(let i = 0; i < recentCities.length; i++){
        let listItem = $("<li></li>").text(recentCities[i].charAt(0).toUpperCase() + recentCities[i].slice(1));
        listItem.addClass("list-group-item");
        listItem.attr("data-value",recentCities[i].charAt(0).toUpperCase() + recentCities[i].slice(1));
        listItem.attr("onlick", "clickOnList()")
        //appending list element to parent list
        listItem.appendTo($("#recent-cities-list"))
    }
}

//method to click on recent city element 
$(function() {
    $('li').click( function() {
        //if click on element, get the data-value attribute which is equals to city name
        //and assign this value to global var cityRecent
        cityRecent = $(this).attr('data-value');
        //and call getCurrentWeather method to use this city
        getCurrentWeather();
    });
});

//method to change the cursos when hovering over the list element
$("li").hover(function(){
    $(this).css("cursor", "pointer");
});