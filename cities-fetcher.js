"use strict";
exports.__esModule = true;
var _ = require('lodash');
var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
var CitiesFetcher = (function () {
    function CitiesFetcher(request) {
        this.request = request;
    }
    CitiesFetcher.prototype.getCities = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.request('http://dira.gov.il/projects/Pages/projects.aspx', function (error, response, body) {
                if (error) {
                    console.log('error:', error); // Print the error if one occurred
                    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    reject(error);
                    return;
                }
                var dom = new JSDOM(body);
                var aElems = dom.window.document.querySelectorAll("h2 a");
                var cities = _.map(aElems, function (aElem) {
                    return {
                        path: aElem.getAttribute('href'),
                        name: aElem.textContent
                    };
                });
                resolve(cities);
            });
        });
    };
    return CitiesFetcher;
}());
exports.CitiesFetcher = CitiesFetcher;
//# sourceMappingURL=cities-fetcher.js.map