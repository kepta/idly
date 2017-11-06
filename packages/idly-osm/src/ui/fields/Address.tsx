import { all } from '../../parsers/presetsInit';
import { Tags } from 'idly-common/lib/osm/structures';
import * as React from 'react';
import Card from 'antd/lib/card';

export interface PropsType {
  tags: Tags;
}

// @TODO use proper nominatim and address format from dataAddressFormat
//  ref iD implementation.

const dropdowns = [
  'city',
  'county',
  'country',
  'district',
  'hamlet',
  'neighbourhood',
  'place',
  'postcode',
  'province',
  'quarter',
  'state',
  'street',
  'subdistrict',
  'suburb'
];
export class Address extends React.PureComponent<PropsType, any> {
  field: any;
  constructor(props) {
    super(props);
    var { field } = all;
    this.field = field('name');
  }
  render() {
    var tags = this.props.tags;
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
        {dropdowns.map((d, i) => (
          <span key={i}>{tags['addr:' + d] || 'Placeholder -' + d}</span>
        ))}
      </Card>
    );
  }
}
