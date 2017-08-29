import * as React from 'react';
import { connect } from 'react-redux';
import Card from 'antd/lib/card';

import { FeatureTable } from 'idly-common/lib/osm/feature';
import {
  EntityId,
  EntityTable,
  EntityType,
  OsmGeometry
} from 'idly-common/lib/osm/structures';

import { PLUGIN_NAME } from '../config/config';
import { getNodeGeometry } from '../helpers/getNodeGeometry';
import { presets, presetsMatcher } from '../presets/presets';
import { nameField, NameField } from './fields/Name';

export interface SelectState {
  readonly selectedIds: EntityId[];
  readonly entityTable: EntityTable;
  readonly featureTable: FeatureTable<any, any>;
}

export interface PropsType {
  idlyState: {
    select: SelectState;
  };
}

const gridStyle = {
  width: '25%',
  textAlign: 'center'
};

export class TestOsm extends React.Component<PropsType, {}> {
  render() {
    if (!this.props.idlyState) {
      throw new Error('no idly state');
    }
    const selectedIds = this.props.idlyState.select.selectedIds;
    // console.log(nameField);
    if (selectedIds.length === 1) {
      const entity = this.props.idlyState.select.entityTable.get(
        selectedIds[0]
      );
      console.log();
      let geometry = this.props.idlyState.select.featureTable.get(
        selectedIds[0]
      ).properties[`${PLUGIN_NAME}.geometry`];

      console.log(presetsMatcher(geometry, entity.tags));
      return (
        <div style={{ margin: 4 }}>
          <NameField tags={entity.tags} />
        </div>
      );
    }
    return null;
  }
}
