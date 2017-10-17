import { tagsFactory } from 'idly-common/lib/osm/tagsFactory';
import { FeatureTable } from 'idly-common/lib/osm/feature';
import { modifyEntity } from 'idly-common/lib/osm/modifyEntity';
import { Entity, Tags } from 'idly-common/lib/osm/structures';
import { Tree } from 'idly-graph/lib/graph/Tree';

import { debounce } from 'lodash';
import * as React from 'react';

export interface PropsType {
  idlyState: {
    core: SelectState;
  };
  selectCommitAction: (r: any) => any;
}
export interface StateType {
  tags: [string, string][];
}

export type SelectState = Readonly<{
  readonly selectedTree: Tree;
  readonly featureTable: FeatureTable<any, any>;
}>;
function getTags(tree: Tree) {
  if (!tree) return [];
  const ids = tree.getKnownIds();
  if (ids.length === 0) {
    return [];
  }
  const entity = tree.entity(ids[0]);
  if (!entity) return [];
  return entity.tags.toArray();
}
function getEntity(tree: Tree): Entity {
  if (!tree) return;
  const ids = tree.getKnownIds();
  if (ids.length === 0) {
    return;
  }
  const entity: Entity | undefined = tree.entity(ids[0]);
  if (!entity) return;
  return entity;
}
export class NewTagsEditor extends React.PureComponent<PropsType, StateType> {
  state = {
    tags: getTags(this.props.idlyState.core.selectedTree)
  };
  componentWillReceiveProps(nextProps: PropsType) {
    this.setState({
      tags: getTags(nextProps.idlyState.core.selectedTree)
    });
  }
  handleChange = (event: any) => {
    const tags = event.target.value.split('\n').map(t => t.split('='));
    this.setState({ tags: tags });
  };

  handleSubmit = (event: any) => {
    console.log(this.state.tags);
    const t = tagsFactory(this.state.tags);
    const en = modifyEntity(getEntity(this.props.idlyState.core.selectedTree), {
      tags: t
    });
    const tree = this.props.idlyState.core.selectedTree;

    this.props.selectCommitAction(
      tree.replace(en),
      this.props.idlyState.core.featureTable
    );
    event.preventDefault();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <textarea
          style={{ fontSize: 24 }}
          value={this.state.tags.map(tag => `${tag[0]}=${tag[1]}`).join('\n')}
          onChange={this.handleChange}
          rows={this.state.tags.length + 4}
        />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
