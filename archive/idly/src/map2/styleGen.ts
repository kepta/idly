export const featureCollection = (d: any[] = []) => ({
  type: 'FeatureCollection',
  features: d
});
const defaultStyle = {
  version: 8,
  name: 'Satellite',
  metadata: { 'mapbox:autocomposite': true, 'mapbox:type': 'default' },
  center: [0, -1.1368683772161603e-13],
  zoom: 0.7414668730339613,
  bearing: 0,
  pitch: 0,
  sources: {
    'mapbox://mapbox.satellite': {
      url: 'mapbox://mapbox.satellite',
      type: 'raster',
      tileSize: 256
    }
  },
  sprite: 'mapbox://sprites/kushan2020/cj5tgoln94m2j2rqnyt5cyhuj',
  glyphs: 'mapbox://fonts/kushan2020/{fontstack}/{range}.pbf',
  layers: [
    // {
    //   id: 'satellite',
    //   type: 'raster',
    //   source: 'mapbox',
    //   'source-layer': 'mapbox_satellite_full'
    // },
    {
      id: 'mapbox-mapbox-satellite',
      type: 'raster',
      source: 'mapbox://mapbox.satellite',
      layout: {},
      paint: {
        'raster-opacity': {
          base: 1,
          stops: [[0, 0.9], [4, 0.75], [18, 0.75], [20, 0.9]]
        },
        'raster-saturation': {
          base: 1,
          stops: [[0, -0.25], [4, -0.5], [16, -0.5], [18, -0.25]]
        },
        'raster-brightness-max': {
          base: 1,
          stops: [[0, 1], [4, 0.8], [16, 0.8], [18, 1]]
        },
        'raster-contrast': {
          base: 1,
          stops: [[0, 0.1], [4, -0.25], [16, -0.25], [18, 0.1]]
        }
      }
    }
  ]
};
export function styleGen(style: any = defaultStyle) {
  return layers => {
    style = {
      ...style,
      layers: [...style.layers, ...layers]
    };
    return sources => ({
      ...style,
      sources: {
        ...style.sources,
        ...sources
      }
    });
  };
}
