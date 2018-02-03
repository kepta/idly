const osmium = require('osmium');

function* readOsm(path, readerConfig) {
  const file = new osmium.File(path);
  const reader = new osmium.Reader(file, readerConfig);
  let buffer;
  while ((buffer = reader.read())) {
    let object;
    while ((object = buffer.next())) {
      yield object;
    }
  }
}

module.exports = filePath => {
  var hrstart = process.hrtime();
  let count2;
  for (const i of readOsm(filePath, {
    node: true,
    way: true,
    relation: true,
  })) {
    count2 = i.id;
  }

  return ['osmium', process.hrtime(hrstart)];
};
