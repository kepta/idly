import * as React from 'react';

import { plugins } from 'plugins';
import { Map } from '../map/map';

export class App extends React.PureComponent {
  state = {
    comp: []
  };
  constructor() {
    super();
    plugins.then(x => {
      if (!x) return;
      this.setState({
        comp: x.components.map(c => c.component)
      });
    });
  }
  render() {
    return (
      <div>
        <Map />
        {this.state.comp.map((C, i) => <C key={i} />)}
      </div>
    );
  }
}
