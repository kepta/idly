import * as React from 'react';
import { Presets } from './presets';
import { Leaf } from 'idly-common/lib/state/graph/Leaf';
import { Map } from './map/index';
export class App extends React.PureComponent {
  render() {
    if (leaf)
      return (
        <div>
          <Presets feature={feat} leaf={leaf} />
          <Map />
        </div>
      );
    return null;
  }
}

const feat = {
  geometry: {
    type: 'LineString',
    coordinates: [
      [-74.00884620845318, 40.71380563464672],
      [-74.01008605957031, 40.71436421368358]
    ]
  },
  type: 'Feature',
  properties: {
    'osm_basic--name': 'Murray Street',
    'osm_basic--icon': 'highway-secondary',
    'osm_basic--geometry': 'line',
    'osm_basic--tagsClass': 'tag-highway',
    'osm_basic--tagsClassType': 'tag-highway-secondary',
    id: 'w222299272'
  },
  layer: {
    id: 'idly-gl-base-src-1-LineLabelLayer',
    type: 'symbol',
    source: 'idly-gl-base-src-1',
    filter: ['all', ['==', '$type', 'LineString']],
    layout: {
      'symbol-placement': 'line',
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-field': '{osm_basic--name}',
      'text-size': 12,
      'text-transform': 'uppercase',
      'text-letter-spacing': 0.05,
      'text-optional': true,
      'text-allow-overlap': false
    },
    paint: {
      'text-halo-color': '#ffffff',
      'text-halo-width': 1.5,
      'text-halo-blur': 0.5
    }
  }
};

const leaf = Leaf.fromString(
  window.atob(
    'WyJ7XCJhdHRyaWJ1dGVzXCI6e1wiY2hhbmdlc2V0XCI6XCI1MjkwMDgzOFwiLFwidGltZXN0YW1wXCI6XCIyMDE3LTEwLTEzVDE2OjM0OjMyWlwiLFwidWlkXCI6XCI0MDIyNjY0XCIsXCJ1c2VyXCI6XCJQYXVsaXNoXCIsXCJ2ZXJzaW9uXCI6XCI0XCIsXCJ2aXNpYmxlXCI6XCJ0cnVlXCJ9LFwiaWRcIjpcIncyMjIyOTkyNzJcIixcIm5vZGVzXCI6W1wibjQyNDI5NTYyXCIsXCJuNDI0Mjk1NjNcIl0sXCJ0YWdzXCI6e1wiaGd2XCI6XCJkZXN0aW5hdGlvblwiLFwiaGlnaHdheVwiOlwic2Vjb25kYXJ5XCIsXCJtYXhzcGVlZFwiOlwiMjUgbXBoXCIsXCJuYW1lXCI6XCJNdXJyYXkgU3RyZWV0XCIsXCJvbmV3YXlcIjpcInllc1wiLFwidGlnZXI6Y2ZjY1wiOlwiQTQxXCIsXCJ0aWdlcjpjb3VudHlcIjpcIk5ldyBZb3JrLCBOWVwiLFwidGlnZXI6bmFtZV9iYXNlXCI6XCJNdXJyYXlcIixcInRpZ2VyOm5hbWVfdHlwZVwiOlwiU3RcIixcInRpZ2VyOnJldmlld2VkXCI6XCJub1wifSxcInR5cGVcIjpcIndheVwifSJd'
  )
);
