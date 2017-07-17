"use strict";
exports.__esModule = true;
var _ = require('lodash');
var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
var CityCalculator = (function () {
    function CityCalculator(request, baseUrl, city, isCitizen) {
        if (isCitizen === void 0) { isCitizen = false; }
        this.request = request;
        this.baseUrl = baseUrl;
        this.city = city;
        this.isCitizen = isCitizen;
    }
    CityCalculator.prototype.calculate = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.request(_this.baseUrl + _this.city.path, function (error, response, body) {
                if (error) {
                    console.log('error:', error); // Print the error if one occurred
                    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    reject(error);
                    return;
                }
                var dom = new JSDOM(body);
                var tables = dom.window.document.querySelectorAll("#GovxTable");
                var projData = _this.getProjData(tables[0]);
                var subscribersData = _this.getSubscribersData(tables[1]);
                var probability = 1 - _.reduce(projData, function (res, flatsNum, projId) {
                    var p = flatsNum / subscribersData[projId];
                    return res * (1 - p);
                }, 1);
                resolve({ city: _this.city.name, probability: probability.toFixed(2) });
            });
        });
    };
    CityCalculator.prototype.getProjData = function (projTable) {
        var _this = this;
        var projRows = projTable.querySelectorAll('tr');
        var projData = {};
        _.each(projRows, function (row) {
            var cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                var numOfFlats = _this.isCitizen ? cells[4].textContent : cells[3].textContent - cells[4].textContent;
                projData[cells[0].textContent] = numOfFlats;
            }
        });
        return projData;
    };
    CityCalculator.prototype.getSubscribersData = function (subscribersTable) {
        var _this = this;
        var sbrRows = subscribersTable.querySelectorAll('tr');
        var sbrData = {};
        _.each(sbrRows, function (row) {
            var cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                var colIdx = _this.isCitizen ? 5 : 4;
                sbrData[cells[0].textContent] = cells[colIdx].textContent.replace(/,/g, "");
            }
        });
        return sbrData;
    };
    return CityCalculator;
}());
exports.CityCalculator = CityCalculator;
//# sourceMappingURL=city-calculator.js.map