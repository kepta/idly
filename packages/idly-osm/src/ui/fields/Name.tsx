import { Tags } from 'idly-common/lib/osm/structures';
import * as React from 'react';
import Card from 'antd/lib/card';

import { presets } from '../../presets/presets';

export interface PropsType {
  tags: Tags;
}
export class NameField extends React.PureComponent<PropsType, any> {
  field: any;
  constructor(props) {
    super(props);
    var { field } = presets;
    this.field = field('name');
  }
  render() {
    return (
      <Card
        title={this.field.key}
        style={{ maxHeight: 100 }}
        bodyStyle={{
          paddingTop: 0,
          paddingBottom: 0,
          boxSizing: 'content-box'
        }}
      >
        <span>{this.props.tags.get(this.field.key) || 'no name'}</span>
      </Card>
    );
  }
}
