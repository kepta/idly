const { DOMParser } = require('xmldom');
const osmtogeojson = require('osmtogeojson');
const { iDParser } = require('../lib/iDParser');
const fs = require('fs');
module.exports = filePath => {
  var data = fs.readFileSync(filePath, 'utf-8');

  var hrstart = process.hrtime();

  const parser = new DOMParser();
  const xml = parser.parseFromString(data, 'text/xml');
  const entities = iDParser(xml);

  return ['iD-xml-parser', process.hrtime(hrstart)];
};
