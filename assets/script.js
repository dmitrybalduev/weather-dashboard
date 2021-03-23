let input = $("#search-input")[0];
const apikey = "5b88f5dd40c49d3c791f09158ad429c0";
let city = "";


function getCurrentWeather() {
    var requestUrl = 'http://api.openweathermap.org/data/2.5/weather';
    city = input.value;
    if (city == "") {
        alert('You need input value for search!');
        return;
      }
    fetch(requestUrl + "?q="+city+"&appid="+apikey)
      .then(function (response) {
          if(response.status != 200){
              alert("Search failed\n" + response.text);
              return;
          }
        return response.json();
      })
      .then(function (data) {
        displayCurrentWeather(data);
        displayUV(data);
      });
      getForecastData();
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

  function getForecastData(info){
    let url = "http://api.openweathermap.org/data/2.5/forecast?"
    fetch(url + "q=" + city + "&appid=" + apikey)
        .then(function (response){
            return response.json();
        })
        .then(function(data){
            for(let i = 0; i < 5; i++){
                let tempDate =  $("h5[data-index='weather-date-"+(i+1)+"']");
                tempDate.text(data.list[i*8].dt_txt.split(' ')[0]);
            }
        })
  }