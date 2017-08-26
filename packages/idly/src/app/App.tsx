import { OsmUi } from 'idly-osm';
import * as React from 'react';
import { Map } from '../map/map';

export class App extends React.PureComponent {
  render() {
    return (
      <div>
        <Map />
        <OsmUi />
      </div>
    );
  }
}
