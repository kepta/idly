import * as topojson from 'topojson';
import * as GeoJSONWorkerSource from 'mapbox-gl/src/source/geojson_worker_source';

class TopoJSONWorkerSource extends GeoJSONWorkerSource {
  loadGeoJSON(params, callback) {
    // defer to the default implementation to grab / JSON.parse the data, which
    // is actually expected to be topojson in our case.
    console.log(params);
    GeoJSONWorkerSource.prototype.loadGeoJSON.call(this, params, function(
      err,
      topo
    ) {
      if (err) {
        return callback(err);
      }
      // once we have it, convert the layer specified in `params` to geojson.
      var data = topojson.feature(topo, topo.objects[params.layer]);
      console.log('data', data, params, topo);
      callback(null, data);
    });
  }
  loadTile(...args) {
    console.log(args);
    debugger;
    var x = super.loadTile.apply(this, args);
    console.log(x);
    return x;
  }
  // loadTile() {
  //   console.log('here');
  // }
}

self.registerWorkerSource('topojson', TopoJSONWorkerSource);
