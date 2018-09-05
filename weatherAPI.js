const yargs = require('yargs');
const request = require('request');
const axios = require('axios');

const argv = yargs
  .options({
    a:  { // setting up the address command
      demand: true,
      alias: 'address',
      describe: 'Address to retrieve weather information.',
      string: true //always parse the user I/P as string
    }
})
  .help()
  .alias('help', 'h')
  .argv;

var encodedAddress = encodeURIComponent(argv.address); //Converting to a web address 
var geocodeURL = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + encodedAddress;

axios.get(geocodeURL).then((response) => {
  if(response.data.status === 'ZERO_RESULTS') {
    throw new Error('Unable to find address.')
  }
  const apiKey = ''; // Insert API from https://darksky.net/dev
  var lat = response.data.results[0].geometry.location.lat;
  var lng = response.data.results[0].geometry.location.lng;
  var weatherURL = 'https://api.darksky.net/forecast/' + apiKey + '/' + lat + ',' + lng;
  console.log(response.data.results[0].formatted_address);
  return axios.get(weatherURL);
}).then((responseWeather) => {
  var temp = responseWeather.data.currently.temperature;
  var apparentTemp = responseWeather.data.currently.apparentTemperature;
  console.log(`Current temperature is ${temp}. Feels like ${apparentTemp}.`);
})
.catch((error) => {
  if(error.code === 'ENOTFOUND') {
    console.log('Unable to connect to API server.');
  }
  else {
    console.log(error.message);
  }
});
