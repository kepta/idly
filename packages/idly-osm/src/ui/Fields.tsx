import { Generic } from './fields/Generic';
import * as React from 'react';
import { connect } from 'react-redux';
import Card from 'antd/lib/card';

import { FeatureTable } from 'idly-common/lib/osm/feature';
import {
  EntityId,
  EntityTable,
  EntityType,
  OsmGeometry,
  Tags
} from 'idly-common/lib/osm/structures';

import { PLUGIN_NAME } from '../config/config';
import { getNodeGeometry } from '../helpers/getNodeGeometry';
import { presets, presetsMatcher } from '../presets/presets';
// import { Localized } from './fields/Localized';

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
const Access = Generic;
const Address = Generic;
const Check = Generic;
const Combo = Generic;
const Cycleway = Generic;
const DefaultCheck = Generic;
const Email = Generic;
const Lanes = Generic;
const Localized = Generic;
const Maxspeed = Generic;
const MultiCombo = Generic;
const NetworkCombo = Generic;
const Number = Generic;
const OnewayCheck = Generic;
const Radio = Generic;
const Restrictions = Generic;
const SemiCombo = Generic;
const StructureRadio = Generic;
const Tel = Generic;
const Text = Generic;
const Textarea = Generic;
const TypeCombo = Generic;
const Url = Generic;
const Wikipedia = Generic;

export class Fields extends React.Component<PropsType, {}> {
  renderMatchingFields(matchingFields, tags: Tags) {
    return matchingFields.map((f, i) => {
      switch (f.type) {
        case 'access':
          return <Access key={i} tags={tags} field={f} />;
        case 'address':
          return <Address key={i} tags={tags} field={f} />;
        case 'check':
          return <Check key={i} tags={tags} field={f} />;
        case 'combo':
          return <Combo key={i} tags={tags} field={f} />;
        case 'cycleway':
          return <Cycleway key={i} tags={tags} field={f} />;
        case 'defaultCheck':
          return <DefaultCheck key={i} tags={tags} field={f} />;
        case 'email':
          return <Email key={i} tags={tags} field={f} />;
        case 'lanes':
          return <Lanes key={i} tags={tags} field={f} />;
        case 'localized':
          return <Localized key={i} tags={tags} field={f} />;
        case 'maxspeed':
          return <Maxspeed key={i} tags={tags} field={f} />;
        case 'multiCombo':
          return <MultiCombo key={i} tags={tags} field={f} />;
        case 'networkCombo':
          return <NetworkCombo key={i} tags={tags} field={f} />;
        case 'number':
          return <Number key={i} tags={tags} field={f} />;
        case 'onewayCheck':
          return <OnewayCheck key={i} tags={tags} field={f} />;
        case 'radio':
          return <Radio key={i} tags={tags} field={f} />;
        case 'restrictions':
          return <Restrictions key={i} tags={tags} field={f} />;
        case 'semiCombo':
          return <SemiCombo key={i} tags={tags} field={f} />;
        case 'structureRadio':
          return <StructureRadio key={i} tags={tags} field={f} />;
        case 'tel':
          return <Tel key={i} tags={tags} field={f} />;
        case 'text':
          return <Text key={i} tags={tags} field={f} />;
        case 'textarea':
          return <Textarea key={i} tags={tags} field={f} />;
        case 'typeCombo':
          return <TypeCombo key={i} tags={tags} field={f} />;
        case 'url':
          return <Url key={i} tags={tags} field={f} />;
        case 'wikipedia':
          return <Wikipedia key={i} tags={tags} field={f} />;
        default:
          return null;
      }
    });
  }
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
      let geometry = this.props.idlyState.select.featureTable.get(
        selectedIds[0]
      ).properties[`${PLUGIN_NAME}.geometry`];

      const matchedPreset = presetsMatcher(geometry, entity.tags);
      // matchedPreset.fields.forEach(f => console.log(f.label()));
      return (
        <div style={{ margin: 4 }}>
          {this.renderMatchingFields(matchedPreset.fields, entity.tags)}
        </div>
      );
    }
    return null;
  }
}