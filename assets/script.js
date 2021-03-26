let input = $("#search-input")[0];
const apikey = "5b88f5dd40c49d3c791f09158ad429c0";
let city = "";
let recentCities = JSON.parse(localStorage.getItem("cities"));
let cityRecent = "";
let isSuccess = false;

function getCurrentWeather() {
    var requestUrl = 'http://api.openweathermap.org/data/2.5/weather';
    if(!cityRecent == ""){
        city = cityRecent;
    }else{
        city = input.value;
    }
    
    if (city == "") {
        alert('You need input value for search!');
        return;
      }
    fetch(requestUrl + "?q="+city+"&appid="+apikey)
      .then(function (response) {
          if(response.status != 200){
              alert("Search failed. Make sure you enter valid city");
              isSuccess =false;
              return;
          }else{
              isSuccess = true;
          }
        return response.json();
      })
      .then(function (data) {
        displayCurrentWeather(data);
        displayUV(data);
        storeCities();
      });
      if(isSuccess){
          getForecastData();
      }
  }

function displayCurrentWeather(info){
    $("#city").text("City: " + info.name);
    let tempKelvin = info.main.temp;
    let tempF = Math.round((tempKelvin - 273.15)*9/5 + 32);
    $("#temperature").text("Temperature: " + tempF + "F");
    $("#humidity").text("Humidity: " + info.main.humidity + "%");
    $("#wind-speed").text("Wind: " + info.wind.speed );
}
function displayUV(info){
    let url="http://api.openweathermap.org/data/2.5/uvi";
    let lat = info.coord.lat;
    let lon = info.coord.lon;
    let uv;
    fetch(url + "?lat=" + lat + "&lon=" + lon + "&appid=" + apikey)
        .then(function (response){
            return response.json();
        })
        .then(function(data){
            uv = data.value;
            $("#uv-index").addClass("d-inline");
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
  displayCities();

  function getForecastData(info){
    let url = "http://api.openweathermap.org/data/2.5/forecast?"
    fetch(url + "q=" + city + "&appid=" + apikey + "&units=imperial")
        .then(function (response){
            return response.json();
        })
        .then(function(data){
            console.log(data.list[0]);
            for(let i = 0; i < 5; i++){
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
        $("#hidden-forecast-area").show();
  }

function storeCities(){
    if(recentCities == null){
        recentCities = [];
    }
    for(let i = 0; i < recentCities.length; i++){
        if(city.toLowerCase() == recentCities[i].toLowerCase()){
            return;
        }
    }
    if(recentCities.length === 5){
        recentCities.shift();
    }
    recentCities.push(city);
    localStorage.setItem("cities", JSON.stringify(recentCities));
}

function displayCities(){
    if(recentCities == null){
        return;
    }
    for(let i = 0; i < recentCities.length; i++){
        let listItem = $("<li></li>").text(recentCities[i].charAt(0).toUpperCase() + recentCities[i].slice(1));
        listItem.addClass("list-group-item");
        listItem.attr("data-value",recentCities[i].charAt(0).toUpperCase() + recentCities[i].slice(1));
        listItem.attr("onlick", "clickOnList()")
        listItem.appendTo($("#recent-cities-list"))
    }
}

$(function() {
    $('li').click( function() {
        cityRecent = $(this).attr('data-value');
        getCurrentWeather();
        console.log($(this).attr('data-value'));
    });
});

$("li").hover(function(){
    $(this).css("cursor", "pointer");
});