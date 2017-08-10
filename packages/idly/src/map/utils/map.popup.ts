import * as _ from 'lodash';
import { LAYERS } from 'map/constants';
import { popup } from 'map/mapboxglSetup';
import * as turf from 'turf';
const SIZE = 10;
export const dirtyPopup = map =>
  LAYERS.map(s => {
    map.on(
      'mouseenter',
      s,
      _.debounce(e => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
        const bbox = [
          [e.point.x - SIZE, e.point.y - SIZE],
          [e.point.x + SIZE, e.point.y + SIZE]
        ];
        if (map.queryRenderedFeatures(bbox, { layers: [s] }).length > 0) {
          map.getCanvas().style.cursor = 'pointer';
        }
        if (!Array.isArray(e.features) || !e.features[0]) return;
        const html = e.features.map(feat => ({
          ...feat,
          id: feat.properties.id,
          tags: JSON.parse(feat.properties.tags),
          node_properties: JSON.parse(
            feat.properties.node_properties || feat.properties.way_properties
          ),
          icon: feat.properties.icon
        }));
        popup
          .setLngLat(turf.centroid(e.features[0]).geometry.coordinates)
          .setHTML(
            `<span style="width:200px"><pre>${JSON.stringify(
              {
                id: e.features.map(f => f.properties.id),
                tags: e.features.map(f => JSON.parse(f.properties.tags))
              },
              null,
              2
            )}</pre>
          </span>`
          )
          .addTo(map);
      }),
      800
    );
    map.on(
      'mouseleave',
      s,
      _.debounce(() => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      }, 100)
    );
  });
