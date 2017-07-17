const _ = require('lodash');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export class CityCalculator {
	constructor(private request, private baseUrl: string, private city, private isCitizen = false) {
	}

  calculate(): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.request(this.baseUrl + this.city.path, (error, response, body) => {
        if(error) {
          console.log('error:', error); // Print the error if one occurred
          console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          reject(error);
          return;
        }

        const dom = new JSDOM(body);
        let tables = dom.window.document.querySelectorAll("#GovxTable");
        let projData = this.getProjData(tables[0]);
        let subscribersData = this.getSubscribersData(tables[1]);

        let probability = 1 - _.reduce(projData, (res, flatsNum, projId) => {
            let p = flatsNum / subscribersData[projId];
            return res * (1 - p);
          }, 1);

        resolve({city: this.city.name, probability: probability.toFixed(2)});
      });
    });
  }

  getProjData(projTable) {
		let projRows = projTable.querySelectorAll('tr');
		let projData = {};
		_.each(projRows, (row) => {
			let cells = row.querySelectorAll('td');
			if(cells.length > 0){
			  let numOfFlats = this.isCitizen ? cells[4].textContent : cells[3].textContent - cells[4].textContent;
				projData[cells[0].textContent] = numOfFlats;
			}
		});

		return projData;
	}

	getSubscribersData(subscribersTable) {
		let sbrRows = subscribersTable.querySelectorAll('tr');
		let sbrData = {};
		_.each(sbrRows, (row) => {
			let cells = row.querySelectorAll('td');
			if(cells.length > 0){
			  let colIdx = this.isCitizen ? 5 : 4;
				sbrData[cells[0].textContent] = cells[colIdx].textContent.replace(/,/g, "");
			}
		});

		return sbrData;
	}
}
