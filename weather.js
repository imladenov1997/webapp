var temperature = 0;
var isFahrenheit = true; // shows Fahrenheit
var forecast; // array of days

// Converts temperature to Celsius
function toCelsius() {
	temperature = 5/9 * (temperature - 32);
	return getTemperature();
}

// Toggles temperature between Celsius and Fahrenheit
function showTemperature() {
	var elem = document.getElementById("temp");
	var button = document.getElementById("temperature");
	if (isFahrenheit) {
		elem.innerHTML = Math.floor(toCelsius()) + "<sup>o</sup> C </br>";
		button.innerHTML = "Set Fahrenheit";
		isFahrenheit = false;
	} else {
		elem.innerHTML = Math.floor(toFahrenheit()) + "<sup>o</sup> F </br>";
		button.innerHTML = "Set Celsius";
		isFahrenheit = true;
	}
	return temperature;	
}

// Converts temperature to Fahrenheit
function toFahrenheit() {
	temperature = (9/5 * temperature) + 32;
	return getTemperature();
}


function getTemperature() {
	return temperature;
}

var request = new XMLHttpRequest();

function getLink() {
	var Link = {
		query: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22",
		city: document.getElementById("city").value,
		jsonFormat: "%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=",
	};
	
	request.open('GET', Link.query+Link.city+Link.jsonFormat, true);
	request.send(null);
	
	request.onreadystatechange = function() {
		if (request.readyState === 4 && request.status >= 200 && request.status <= 299) {
			var myObj = JSON.parse(request.responseText);
			temperature = myObj.query.results.channel.item.condition.temp;
			forecast = myObj.query.results.channel.item.forecast;
			
			document.getElementById("title").innerHTML = "<strong>" + myObj.query.results.channel.title + "</strong></br>";
			document.getElementById("data").innerHTML = "<em>" + myObj.query.results.channel.item.title + "<em></br>";
			document.getElementById("temp").innerHTML = temperature + "<sup>o</sup> F </br>";
			document.getElementById("text").innerHTML = myObj.query.results.channel.item.condition.text + "</br></br>";
			document.getElementById("wind").innerHTML = "Wind Speed: " + myObj.query.results.channel.wind.speed + " mph </br>";
			document.getElementById("humidity").innerHTML = "Humidity: " + myObj.query.results.channel.atmosphere.humidity + "% </br>";
			document.getElementById("sunrise").innerHTML = "Sunrise: " + myObj.query.results.channel.astronomy.sunrise + " </br>";
			document.getElementById("sunset").innerHTML = "Sunset: " + myObj.query.results.channel.astronomy.sunset + "</br></br>";
			
			var box = "<select id='selectbox' onchange='seeForecast()'>";
			for (i = 0; i < forecast.length; i++) {
				box += "<option value=" + i + ">" + forecast[i].date + "</option>";
			}
			box += "</select>";
			document.getElementById("box").innerHTML = box;
			
			isFahrenheit = true;
			var button = document.getElementById("temperature");
			button.innerHTML = "Set Celsius";
		}
	}
};

function enterKey(e) {
	if (e.keyCode == 13) {
		getLink();
	}
}



function seeForecast() {
	// Gets the selected box and takes the element from it, will be used later
	if (forecast != null) {
		var e = document.getElementById("selectbox");
		var out = e.options[e.selectedIndex].value;	
		var day = forecast[out];
		document.getElementById("fcdate").innerHTML = "Date: " + day.date + "</br>";
		document.getElementById("fchigh").innerHTML = "Highest temperature: " + day.high + "<sup>o</sup> F </br>";
		document.getElementById("fclow").innerHTML = "Lowest temperature: " + day.low + "<sup>o</sup> F </br>";
		document.getElementById("fctext").innerHTML = day.text;
	}
}
