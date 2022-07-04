var span = $('<span>')
var superscript = $('<sup>')
var degreeSign = superscript.text('o')
var fahrenheit = span.text('F')

var tempArray = []
var windArray = []
var humidityArray = []
var uvArray = []
var iconArray = []
var today = Date()
var timeZone = getTimezoneOFFset()
console.log(timeZone)
var UniTime = parseInt(Math.floor(moment()))
var miliSecondsInDay = 86400000
var todays = new Date(UniTime + miliSecondsInDay * 3)
console.log(todays)

for (var x = 0; x < 6; x++) {
    var section = $('<section>');
    $('body').append(section);
    var h2 = $('<h2>')
    section.append(h2)
    section.addClass(`${x}Data`);
    for (var i = 0; i < 5; i++) {
        var div = $('<div>');
        section.append(div);
    }
}


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
    tempArray.push(currentTemp);
    windArray.push(currentWind);
    humidityArray.push(currentHumidity);
    uvArray.push(currentUV)
    iconArray.push(currentIcon)

    for (var i = 1; i < 6; i++) {
        var wind = weatherData.daily[i].wind_speed;
        var humidity = weatherData.daily[i].humidity;
        var uV = weatherData.daily[i].uvi;
        var icon = weatherData.daily[i].weather[0].icon;
        var temp = weatherData.daily[i].temp.day;
        tempArray.push(temp);
        windArray.push(wind);
        humidityArray.push(humidity);
        uvArray.push(uV)
        iconArray.push(icon)
    }

    for (var i = 0; i < 6; i++) {

        $(`.${i}Data`).children().eq(0).text(new Date(UniTime + miliSecondsInDay * i).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" }));
        $(`.${i}Data`).children().eq(1).html(`Temperature: ${tempArray[i]}<sup>o</sup>F`);
        $(`.${i}Data`).children().eq(2).text('Wind: ' + windArray[i] + 'MPH');
        $(`.${i}Data`).children().eq(3).text('Humidity: ' + humidityArray[i] + "%");
        $(`.${i}Data`).children().eq(4).text('UV Index: ' + uvArray[i]);;

    }

});



