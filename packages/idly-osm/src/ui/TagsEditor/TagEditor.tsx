import { FeatureTable } from 'idly-common/lib/osm/feature';
import { Entity, Tags } from 'idly-common/lib/osm/structures';
import { Shrub } from 'idly-graph/lib/graph/Shrub';
import { debounce } from 'lodash';
import * as React from 'react';

import { TagForm } from './TagForm';

export interface PropsType {
  idlyState: {
    core: SelectState;
  };
}
export interface StateType {
  tags: Tags | undefined;
}

export type SelectState = Readonly<{
  readonly selectedShrub: Shrub;
  readonly featureTable: FeatureTable<any, any>;
}>;

export class TagEditor extends React.PureComponent<PropsType, StateType> {
  state: StateType = { tags: undefined };
  componentWillReceiveProps(nextProps: PropsType) {
    // const selectedId = nextProps.idlyState.core.selectedShrub.toObject()
    //   .knownIds;
    const leaf = nextProps.idlyState.core.selectedShrub.getLeaves()[0];

    if (leaf) {
      this.setState({ tags: leaf.getEntity().tags });
    }
  }
  modifyEntity = (tags?: Tags) => {
    // if (tags) {
    //   const selectedId = this.props.idlyState.core.selectedShrub.getKnownIds();
    //   if (Array.isArray(selectedId)) {
    //     let entity:
    //       | Entity
    //       | undefined = this.props.idlyState.core.selectedShrub.entity(
    //       selectedId[0]
    //     );
    //     if (entity) {
    //       entity = modifyEntity(entity, { tags });
    //     }
    //   }
    // }
  };

  // onChange = debounce((changedFields: any) => {
  //   let stateTags = this.state.tags;
  //   // let tagsArray: [string, string][] = stateTags.toArray();
  //   // console.log('old tagsArray', JSON.stringify(tagsArray));
  //   Object.keys(changedFields).forEach(fieldKey => {
  //     if (!stateTags) return;
  //     const rowKey = fieldKey.slice(4);
  //     const prefix = fieldKey.slice(0, 4);

  //     let tagKey = rowKey;
  //     let tagVal = stateTags[rowKey];
  //     console.log('old =', tagKey, tagVal);
  //     if (prefix === 'key_' && changedFields[fieldKey].value !== tagKey) {
  //       tagKey = changedFields[fieldKey].value;
  //     }

  //     if (prefix === 'val_' && changedFields[fieldKey].value !== tagVal) {
  //       tagVal = changedFields[fieldKey].value;
  //     }
  //     if (!tagVal) return;
  //     console.log(tagKey, tagVal);
  //     stateTags = { ...stateTags };
  //     delete stateTags[rowKey];
  //     stateTags = {
  //       ...stateTags,
  //       [tagKey]: tagVal
  //     };
  //   });
  //   // console.log('new tagsArray', JSON.stringify(tagsArray));
  //   this.setState({
  //     tags: stateTags
  //   });
  //   this.modifyEntity(stateTags);
  // }, 1000);
  render() {
    // const selectedId = this.props.idlyState.select.selectedIds;
    return null;
    // return <TagForm tags={this.state.tags} onChange={this.onChange} />;
  }
}
