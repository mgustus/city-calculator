import {CityCalculator} from "./city-calculator";
import {CitiesFetcher} from './cities-fetcher';
const _ = require('lodash');
const request = require('request');

const baseUrl = 'http://dira.gov.il';
const proxyRequest = request.defaults({'proxy':'http://web-proxy.il.hpecorp.net:8080'});
const citiesFetcher = new CitiesFetcher(proxyRequest);

citiesFetcher.getCities().then((cities) => {
  //calculate all cities
  let promises = cities.map((city) => {
    let calculator = new CityCalculator(proxyRequest, baseUrl, city);
    return calculator.calculate();
  });

  //calculate Herzliya citizen
  let calculator = new CityCalculator(proxyRequest, baseUrl, {path: '/projects/Pages/herzliya.aspx', name: 'תושב הרצליה'}, true);
  promises.push(calculator.calculate());

  Promise.all(promises).then((cityResults) => {
    let sortedCityResults = _.sortBy(cityResults, ['probability']).reverse();
    console.dir(sortedCityResults);
  })
});
