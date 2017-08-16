var GeoJSONSource = require('mapbox-gl/src/source/geojson_source');

// console.log(GeoJSONSource.toString());

var MyWorker = require('worker-loader?inline&fallback=false!./worker.ts');

var { objectURL } = new MyWorker();
// var x = new Worker(objectURL);
class TopoJSONSource extends GeoJSONSource {
  // constructor(id, options, dispatcher) {
  //   super(id, options, dispatcher);
  //   this.type = 'topojson';
  // }
}

TopoJSONSource.workerSourceURL = objectURL;
export { TopoJSONSource };
