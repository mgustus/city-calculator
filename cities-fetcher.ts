const _ = require('lodash');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export class CitiesFetcher {
  constructor(private request) {
  }

  getCities(): Promise<Object[]> {
    return new Promise((resolve, reject) => {
      this.request('http://dira.gov.il/projects/Pages/projects.aspx', (error, response, body) => {
        if(error) {
          console.log('error:', error); // Print the error if one occurred
          console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          reject(error);
          return;
        }

        const dom = new JSDOM(body);
        let aElems = dom.window.document.querySelectorAll("h2 a");

        let cities = _.map(aElems, (aElem) => {
          return {
            path: aElem.getAttribute('href'),
            name: aElem.textContent
          }
        });

        resolve(cities);
      });
    });
  }

}
