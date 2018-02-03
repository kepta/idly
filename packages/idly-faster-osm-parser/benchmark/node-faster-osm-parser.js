const { nodejsParser } = require('../lib/nodejsParser');
const fs = require('fs');
module.exports = filePath => {
  var hrstart = process.hrtime();
  let count;
  for (const i of nodejsParser(filePath)) {
    count = i.id;
  }
  return ['node-faster-osm-parser', process.hrtime(hrstart)];
};
