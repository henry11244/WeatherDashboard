// Declaring variables
var span = $('<span>')
var superscript = $('<sup>')
var degreeSign = superscript.text('o')
var fahrenheit = span.text('F')
var timeBlock = $('.timeBlock')
var tempArray = []
var windArray = []
var humidityArray = []
var uvArray = []
var iconArray = []
var cityInputValue = document.querySelector('#cityInputValue')

// To pull dates
var today = Date()
var UniTime = parseInt(Math.floor(moment()))
var miliSecondsInDay = 86400000
var todays = new Date(UniTime + miliSecondsInDay * 3)

// To update the time every second
setInterval(function () {
    timeBlock.text(moment()), 1000
})

// To pull from local storage the search history
var locationSearches = []
if (JSON.parse(localStorage.getItem('locationSearches') !== null)) { locationSearches = JSON.parse(localStorage.getItem('locationSearches')) }

// Populates the search history in the form of buttons on page load and after each search
buttonFunction = () => {
    for (var i = 0; i < locationSearches.length; i++) {
        var button = $('<button>')
        button.click(function () {
            cityInputValue.value = this.className
            $('#cityInput').submit()
        })
        button.text(locationSearches[i]).addClass(locationSearches[i])
        $('#priorSearches').append(button)
    }
}

// calling button function above on page load
buttonFunction()

// Adding 6 sections that will be used for the 5 day forecast plus current day
for (var x = 0; x < 6; x++) {
    var section = $('<section>');
    section.addClass('dailyForecast')
    $('#forcast').append(section);
    var h2 = $('<h2>')
    var newImg = $('<img>')
    newImg.addClass(`${x}img col-5 img`)
    section.append(h2).addClass('col-2 d-flex flex-column')
    section.append(newImg)
    section.addClass(`${x}Data`);
    for (var i = 0; i < 5; i++) {
        var div = $('<div>');
        section.append(div);
    }
}

// creating invalid city message
function newP() {
    var newP = $('<p>');
    newP.text('Enter valid city name').addClass('invalidCity');
    $('form').append(newP);
    $('.invalidCity').css('display', 'none');
}

// calling invalid city function above
newP()

// funciton that is ran when form is submitted
function submit(e) {
    e.preventDefault();
    $('#priorSearchesHeader').css('display', 'block');
    tempArray = [];
    windArray = [];
    humidityArray = [];
    uvArray = []
    iconArray = []
    city = cityInputValue.value
    console.log(city)
    success = false;
    pullRequest(city)
    $('#priorSearches').css('display', 'block')
    $('.invalidCity').css('display', 'none')
    $('button').remove()
}

// calls submit function above when user submits the form
$('#cityInput').submit(submit)

// request to pull latitude and longitude based on city search
var pullRequest = (cityName) => {
    $.ajax({
        url: `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=676c57c39d556b42d524ee448e04b39d`,
        method: 'GET',
    }).then(function (response) {
        cityDetails = response
        responseStatus = response.status
        lat = response[0].lat
        lon = response[0].lon
        success = true

        // plugs lat/long from above into weather API to pull weather data 
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=676c57c39d556b42d524ee448e04b39d`,
            method: 'GET',
        }).then(function (response) {
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

            // populates arrays based on 5 day weather forecasts
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

            // adds weather data/icon to HTML webpage
            for (var i = 0; i < 6; i++) {
                var imgs = document.querySelectorAll('img')
                imgs[i + 1].setAttribute('src', `https://openweathermap.org/img/wn/${iconArray[i]}@2x.png`)
                imgs[0].setAttribute('src', `https://openweathermap.org/img/wn/${iconArray[0]}@2x.png`)
                imgs[i + 1].style.display = ('block')
                $(`.${i}Data`).children().eq(0).text(new Date(UniTime + miliSecondsInDay * i).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })).addClass('text');
                $(`.${i}Data`).children().eq(2).html(`Temperature: ${tempArray[i]}<sup>o</sup>F`).addClass('text');
                $(`.${i}Data`).children().eq(3).text('Wind: ' + windArray[i] + 'MPH').addClass('text');
                $(`.${i}Data`).children().eq(4).text('Humidity: ' + humidityArray[i] + "%").addClass('text');
                $(`.${i}Data`).children().eq(5).text('UV Index: ' + uvArray[i]).addClass('col-12 ml-0 pl-0 text');
                if (uvArray[i] > 10) {
                    $(`.${i}Data`).children().eq(5).css('background-color', 'purple').css('height', '25px')
                }
                else if (uvArray[i] > 7) {
                    $(`.${i}Data`).children().eq(5).css('background-color', 'red').css('height', '25px')
                }
                if (uvArray[i] > 5) {
                    $(`.${i}Data`).children().eq(5).css('background-color', 'orange').css('height', '25px')
                }
                else if (uvArray[i] > 2) {
                    $(`.${i}Data`).children().eq(5).css('background-color', 'yellow').css('height', '25px')
                }
                else {
                    $(`.${i}Data`).children().eq(5).css('background-color', 'rgb(134, 255, 206)').css('height', '25px')
                }
            }
        });

        // if AJAX above is successful and the city is not already saved in local storage, add it to local storage 
    }).done(function () {
        repeat = false
        for (var i = 0; i < locationSearches.length; i++) {
            if (cityName.trim().toUpperCase() == locationSearches[i].trim().toUpperCase()) { repeat = true }
        }
        if (repeat == false) {
            locationSearches.unshift(cityName);
            localStorage.setItem('locationSearches', JSON.stringify(locationSearches))
        }
        buttonFunction()
    })
        // if AJAx fails, display fail message 
        .fail(function () {
            $('.invalidCity').css('display', 'block').css('color', 'red');
            $('#priorSearchesHeader').css('display', 'none');
        })
}




