import { FeatureTable } from 'idly-common/lib/osm/feature';
import { Tags } from 'idly-common/lib/osm/structures';
import { Tree } from 'idly-graph/lib/graph/Tree';
import * as React from 'react';

import { PLUGIN_NAME } from '../config/config';
import { presetsMatcher } from '../presets/presets';
import { Generic } from './fields/Generic';

export type SelectState = Readonly<{
  readonly selectedTree: Tree;
  readonly featureTable: FeatureTable<any, any>;
}>;

export interface PropsType {
  idlyState: {
    core: SelectState;
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
    if (!this.props.idlyState.core || !this.props.idlyState.core.selectedTree) {
      return null;
    }
    const selected = this.props.idlyState.core.selectedTree;

    const selectedIds = selected.getKnownIds();

    console.log(selected, this.props.idlyState.core.featureTable);
    if (selectedIds.length === 1) {
      const entity = selected.entity(selectedIds[0]);
      let geometry = this.props.idlyState.core.featureTable.get(selectedIds[0])
        .properties[`${PLUGIN_NAME}--geometry`];

      const matchedPreset = presetsMatcher(geometry, entity.tags);
      return (
        <div style={{ margin: 4 }}>
          {this.renderMatchingFields(matchedPreset.fields, entity.tags)}
        </div>
      );
    }
    return null;
  }
}
