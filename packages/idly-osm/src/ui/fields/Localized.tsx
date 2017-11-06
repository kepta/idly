import { all } from '../../parsers/presetsInit';
import { Tags } from 'idly-common/lib/osm/structures';
import * as React from 'react';
import Card from 'antd/lib/card';

export interface PropsType {
  tags: Tags;
}
export class Localized extends React.PureComponent<PropsType, any> {
  field: any;
  constructor(props) {
    super(props);
    var { field } = all;
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
        <span>{this.props.tags[this.field.key] || 'no name'}</span>
      </Card>
    );
  }
}
