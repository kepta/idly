const cTable = require('console.table');
const path = require('path');
var argv = require('minimist')(process.argv.slice(2));

const filePath = getAbsPath(argv._[0] || './benchmark/small.osm');

function getAbsPath(p) {
  if (path.isAbsolute(p)) return p;
  return path.join(process.cwd(), p);
}

var tasks = shuffle([require('./node-faster-osm-parser'), require('./osmium')]);

var res = tasks
  .map(t => parseHR(t(filePath)))
  .sort((a, b) => a[0].localeCompare(b[0]));

console.table(res);

function parseHR([name, hrend]) {
  return [name, `${hrend[0]}s, ${hrend[1] / 1000000}ms`];
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
