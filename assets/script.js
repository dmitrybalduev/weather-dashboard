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
        console.log(data);
      });
  }
  
  $("button").on('click', getCurrentWeather);