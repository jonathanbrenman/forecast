
const Promise 	   = require('es6-promise').Promise;
const axios   	   = require("axios");
const express 	   = require('express');
const app     	   = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

const getForecast = async (city) => {
	try {
		return await axios.get(`https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${city}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`);
	} catch (error) {
		return error;
	}
}

const cities = ['Buenos Aires', 'London', 'Berlin', 'Moscow'];

app.get('/*',function(req, res) {
	let promises = [];
	cities.map((city,i) => {
		promises[i] = new Promise(function(resolve) {
			getForecast(city).then((response) =>{
				resolve({
					city: city,
					forecast: response.data.query.results.channel.item.forecast
				});
			});
		});
	});
	Promise.all(promises).then(data => {
		console.log(data);
		res.render('pages/index', {
			items: data
		});
	});
});

app.listen(8901, () => console.log('http://localhost:8901'));