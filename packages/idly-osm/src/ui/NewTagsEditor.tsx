import { Shrub } from 'idly-common/lib/state/graph/shrub';
import { tagsFactory } from 'idly-common/lib/osm/tagsFactory';
import { FeatureTable } from 'idly-common/lib/osm/feature';
import { Entity, Tags } from 'idly-common/lib/osm/structures';

import { debounce } from 'lodash';
import * as React from 'react';

export interface PropsType {
  idlyState: {
    core: SelectState;
  };
  selectCommitAction: (r: any) => any;
}
export interface StateType {
  tags: Tags;
}

export type SelectState = Readonly<{
  readonly selectedShrub: Shrub;
  readonly featureTable: FeatureTable<any, any>;
}>;
function getTags(shrub: Shrub): Tags {
  if (!shrub) return {};
  const ids = shrub.toObject().knownIds;
  if (ids.length === 0) {
    return {};
  }
  const leaf = shrub.getLeaf(ids[0]);
  if (!leaf) return {};
  return leaf.getEntity().tags;
}

function getEntity(shrub: Shrub): Entity | undefined {
  if (!shrub) return;
  const leaf = shrub.getLeaves()[0];
  if (!leaf) {
    return;
  }
  const entity: Entity | undefined = leaf.getEntity();
  return entity;
}
export class NewTagsEditor extends React.PureComponent<PropsType, StateType> {
  state = {
    tags: getTags(this.props.idlyState.core.selectedShrub)
  };
  componentWillReceiveProps(nextProps: PropsType) {
    this.setState({
      tags: getTags(nextProps.idlyState.core.selectedShrub)
    });
  }
  handleChange = (event: any) => {
    const tags = event.target.value.split('\n').map(t => t.split('='));
    this.setState({ tags: tags });
  };

  handleSubmit = (event: any) => {
    // const t = tagsFactory(this.state.tags);
    // const en = modifyEntity(
    //   getEntity(this.props.idlyState.core.selectedShrub),
    //   {
    //     tags: t
    //   }
    // );
    const leaf = this.props.idlyState.core.selectedShrub.getLeaves()[0];
    if (!leaf) return;
    // const {} = s
    // this.props.selectCommitAction(
    // //  Shrub.create() shrub.replace(en),
    //   this.props.idlyState.core.featureTable
    // );
    // event.preventDefault();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <textarea
          style={{ fontSize: 24 }}
          value={Object.keys(this.state.tags)
            .map(t => `${t}=${this.state.tags[t]}`)
            .join('\n')}
          onChange={this.handleChange}
          rows={Object.keys(this.state.tags).length + 4}
        />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
