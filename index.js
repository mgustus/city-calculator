"use strict";
exports.__esModule = true;
var city_calculator_1 = require("./city-calculator");
var cities_fetcher_1 = require("./cities-fetcher");
var _ = require('lodash');
var request = require('request');
var baseUrl = 'http://dira.gov.il';
var proxyRequest = request.defaults({ 'proxy': 'http://web-proxy.il.hpecorp.net:8080' });
var citiesFetcher = new cities_fetcher_1.CitiesFetcher(proxyRequest);
citiesFetcher.getCities().then(function (cities) {
    //calculate all cities
    var promises = cities.map(function (city) {
        var calculator = new city_calculator_1.CityCalculator(proxyRequest, baseUrl, city);
        return calculator.calculate();
    });
    //calculate Herzliya citizen
    var calculator = new city_calculator_1.CityCalculator(proxyRequest, baseUrl, { path: '/projects/Pages/herzliya.aspx', name: 'תושב הרצליה' }, true);
    promises.push(calculator.calculate());
    Promise.all(promises).then(function (cityResults) {
        var sortedCityResults = _.sortBy(cityResults, ['probability']).reverse();
        console.dir(sortedCityResults);
    });
});
//# sourceMappingURL=index.js.map