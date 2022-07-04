var span = $('<span>')
var superscript = $('<sup>')
var degreeSign = superscript.text('o')
var fahrenheit = span.text('F')

// for (var i = 0; i < 5; i++) {
var section = $('<section>').addClass('0Data')
// }

$.ajax({
    url: 'https://api.openweathermap.org/data/2.5/onecall?lat=34.0522&lon=-118.2437&units=imperial&appid=676c57c39d556b42d524ee448e04b39d',
    method: 'GET',
}).then(function (response) {
    console.log('AJAX Response \n-------------');
    console.log(response);
    weatherData = response;
    currentWind = weatherData.current.wind_speed;
    currentHumidity = weatherData.current.humidity;
    currentUV = weatherData.current.uvi;
    currentIcon = weatherData.current.weather[0].icon;
    currentTemp = weatherData.current.temp;
    current = [currentTemp, currentWind, currentHumidity, currentUV, currentIcon]

    $('#0Data').children().eq(1).text('Temperature: ' + currentTemp).append(degreeSign).append(fahrenheit);
    $('#0Data').children().eq(2).text('Wind: ' + currentWind + 'MPH');
    $('#0Data').children().eq(3).text('Humidity: ' + currentHumidity + "%");
    $('#0Data').children().eq(4).text('UV Index: ' + currentUV);;



});



