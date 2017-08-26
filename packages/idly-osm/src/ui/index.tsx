import * as React from 'react';
import { connect } from 'react-redux';

class _OsmUi extends React.PureComponent {
  render() {
    console.log(this.props);
    const id = this.props.select.entities && this.props.select.entities.toJS();
    return (
      <div>
        {JSON.stringify(id)}
      </div>
    );
  }
}
export const OsmUi = connect<any, any, any>((state, props) => ({
  select: state.select
}))(_OsmUi);
