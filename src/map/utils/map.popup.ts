
import { SOURCES } from 'map/map';
import { popup } from 'map/mapboxglSetup';

export const dirtyPopup = map =>
  SOURCES.map(s => {
    map.on('mouseenter', s.layer, e => {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = 'pointer';
      const bbox = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5]
      ];
      if (map.queryRenderedFeatures(bbox, { layers: [s.layer] }).length > 0) {
        map.getCanvas().style.cursor = 'pointer';
      }
      popup
        .setLngLat(e.features[0].geometry.coordinates)
        .setHTML(e.features[0].properties.id)
        .addTo(map);
    });
    map.on('mouseleave', s.layer, () => {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });
  });