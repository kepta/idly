import * as React from 'react';
import { connect } from 'react-redux';

export class TestOsm extends React.PureComponent {
  render() {
    if (!this.props.idlyState) {
      throw new Error('no idly state');
    }
    const id =
      this.props.idlyState.select.entities &&
      this.props.idlyState.select.entities.toJS();
    return (
      <div>
        {JSON.stringify(id, null, 2)}
      </div>
    );
  }
}
