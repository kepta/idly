import { Tags } from 'idly-common/lib/osm/structures';
import * as React from 'react';
import Card from 'antd/lib/card';

import { presets } from '../../presets/presets';

export interface PropsType {
  tags: Tags;
  field: any;
}

// @TODO use proper nominatim and address format from dataAddressFormat
//  ref iD implementation.

export class Generic extends React.PureComponent<PropsType, any> {
  // field: any;
  // constructor(props) {
  //   super(props);
  //   var { field } = presets;
  // }
  render() {
    var tags = this.props.tags;
    let key = this.props.field.key;
    const title = this.props.field.keys ? this.props.field.type : key;

    if (!this.props.field.keys) {
      key = [key];
    } else {
      key = this.props.field.keys;
    }
    return (
      <Card
        title={title + ', ' + this.props.field.type}
        style={{ minHeight: 100 }}
        bodyStyle={{
          paddingTop: 0,
          paddingBottom: 0,
          boxSizing: 'content-box'
        }}
      >
        <div>
          {key
            .filter(k => tags.get(k))
            .map((k, i) => (
              <span key={i}>{tags.get(k) || 'Placeholder -' + k}</span>
            ))}
        </div>
      </Card>
    );
  }
}
