const { parser } = require('../lib');
const fs = require('fs');

module.exports = filePath => {
  var data = fs.readFileSync(filePath, 'utf-8');

  var hrstart = process.hrtime();

  const result = parser(data);

  return ['faster-osm-parser', process.hrtime(hrstart)];
};
