import { LAYERS } from 'map/constants';
import { popup } from 'map/mapboxglSetup';

export const dirtyPopup = map =>
  LAYERS.map(s => {
    map.on('mouseenter', s, e => {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = 'pointer';
      const bbox = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5]
      ];
      if (map.queryRenderedFeatures(bbox, { layers: [s] }).length > 0) {
        map.getCanvas().style.cursor = 'pointer';
      }
      if (!Array.isArray(e.features) || !e.features[0]) return;
      popup
        .setLngLat(e.features[0].geometry.coordinates)
        .setHTML(
          `<span style="width:200px"><pre>${JSON.stringify(
            {
              geom: e.features[0].properties.geometry,
              id: e.features[0].properties.id,
              tags: JSON.parse(e.features[0].properties.tags),
              node_properties: JSON.parse(
                e.features[0].properties.node_properties
              ),
              icon: e.features[0].properties.icon
            },
            null,
            2
          )}</pre>
          </span>`
        )
        .addTo(map);
    });
    map.on('mouseleave', s, () => {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });
  });
