import { tagsFactory } from 'idly-common/lib/osm/tagsFactory';
import { FeatureTable } from 'idly-common/lib/osm/feature';
import { EntityId, EntityTable, Tags } from 'idly-common/lib/osm/structures';
import { TagForm } from './TagForm';
import { debounce } from 'lodash';

import * as React from 'react';
import { Input, Col, Form } from 'antd';

export interface PropsType {
  idlyState: {
    select: SelectState;
  };
}
export interface StateType {
  tags: Tags | undefined;
}
export interface SelectState {
  readonly selectedIds: EntityId[];
  readonly entityTable: EntityTable;
  readonly featureTable: FeatureTable<any, any>;
}

export class TagEditor extends React.PureComponent<PropsType, StateType> {
  state: StateType = { tags: undefined };
  componentWillReceiveProps(nextProps: PropsType) {
    const selectedId = nextProps.idlyState.select.selectedIds;
    if (Array.isArray(selectedId)) {
      const tags = nextProps.idlyState.select.entityTable.get(selectedId[0])
        .tags;

      this.setState({ tags });
    }
  }
  onChange = debounce((changedFields: any) => {
    var stateTags = this.state.tags;
    if (stateTags) {
      // let tagsArray: [string, string][] = stateTags.toArray();
      // console.log('old tagsArray', JSON.stringify(tagsArray));
      Object.keys(changedFields).forEach(fieldKey => {
        if (!stateTags) return;
        const rowKey = fieldKey.slice(4);
        const prefix = fieldKey.slice(0, 4);

        let tagKey = rowKey;
        let tagVal = stateTags.get(rowKey);
        console.log('old =', tagKey, tagVal);
        if (prefix === 'key_' && changedFields[fieldKey].value !== tagKey) {
          tagKey = changedFields[fieldKey].value;
        }

        if (prefix === 'val_' && changedFields[fieldKey].value !== tagVal) {
          tagVal = changedFields[fieldKey].value;
        }
        if (!tagVal) return;
        console.log(tagKey, tagVal);
        stateTags = stateTags.delete(rowKey);
        stateTags = stateTags.set(tagKey, tagVal);
      });
      // console.log('new tagsArray', JSON.stringify(tagsArray));
      this.setState({
        tags: stateTags
      });
    }
  }, 1000);
  render() {
    const selectedId = this.props.idlyState.select.selectedIds;

    return <TagForm tags={this.state.tags} onChange={this.onChange} />;
  }
}
