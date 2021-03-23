let input = $("#search-input")[0];
const apikey = "5b88f5dd40c49d3c791f09158ad429c0";


function getCurrentWeather() {
    // Insert the API url to get a list of your repos
    var requestUrl = 'http://api.openweathermap.org/data/2.5/weather';
    let city = input.value;
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
  }

function displayCurrentWeather(info){
    // let uvindex = getUV(info);
    $("#city").text("City: " + info.name);
    let tempKelvin = info.main.temp;
    let tempF = Math.round((tempKelvin - 273.15)*9/5 + 32);
    $("#temperature").text("Temperature: " + tempF + "F");
    $("#humidity").text("Humidity: " + info.main.humidity + "%");
    $("#wind-speed").text("Wind: " + info.wind.speed);
    // $("#uv-index").text("UV-Index: " + uvindex);
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
            console.log(data.value);
            $("#uv-index").text("UV-Index: " + data.value);
        })
}
  $("button").on('click', getCurrentWeather);
