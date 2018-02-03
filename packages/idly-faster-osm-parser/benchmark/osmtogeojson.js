const { DOMParser } = require('xmldom');
const osmtogeojson = require('osmtogeojson');
const fs = require('fs');
module.exports = filePath => {
  var data = fs.readFileSync(filePath, 'utf-8');

  var hrstart = process.hrtime();

  const parser = new DOMParser();
  const xml = parser.parseFromString(data, 'text/xml');

  const d = osmtogeojson(xml, {
    flatProperties: true,
  });

  return ['osmtogeojson', process.hrtime(hrstart)];
};
