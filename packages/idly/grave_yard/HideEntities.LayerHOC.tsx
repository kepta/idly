import { Set } from 'immutable';
import * as React from 'react';

import { ILayerSpec } from 'map/utils/layerFactory';
import { setSubtractEntities } from 'map/utils/setSubtract';
import { Entities } from 'osm/entities/entities';
import { getComponentName } from 'utils/getComponentName';

// ref to template.hoc.tsx for understanding hoc and typings

interface IPropsType {
  entities: Entities;
  layer: ILayerSpec;
}

interface IStateType {
  toRemove: Set<string>;
}

interface IInjectedProps {
  layer: ILayerSpec;
}

/**
 * Dont get scared with the syntatic noise.
 * Also I feel this noise is a fair trade
 * for the benefits of an abstracted way to inject
 * the functionality this HOC does.
 *
 * @DESC this Layer HOC simply injects a list of
 *  ids to filter in a layer, depending on
 *  some logic and assumptions.
 *  basic idea (filter, entities) -> filter*
 *  where filter* is filter with updated ['!in', 'id', ...idsToFilter]
 */
export const hideEntitiesFiltersHoc = () => <ChildCompProps extends {}>(
  Child:
    | React.ComponentClass<ChildCompProps & IInjectedProps>
    | React.StatelessComponent<ChildCompProps & IInjectedProps>
) => {
  type ResultProps = ChildCompProps & IPropsType;
  return class HideEntities extends React.PureComponent<
    ResultProps,
    IStateType
  > {
    static displayName = `HideEntitiesFilters-${getComponentName(Child)}`;

    state = {
      toRemove: Set() as Set<string>
    };

    componentWillReceiveProps(nextProps: Readonly<ResultProps>) {
      const removedEntities = setSubtractEntities(
        this.props.entities,
        nextProps.entities
      );
      const addedEntities = setSubtractEntities(
        nextProps.entities,
        this.props.entities
      );
      if (removedEntities.size > 0 && addedEntities.size === 0) {
        const toRemove = this.state.toRemove.union(
          removedEntities.map(e => e.id)
        );
        this.setState({
          toRemove
        });
      } else if (addedEntities.size > 0) {
        const toRemove = this.state.toRemove.clear();
        this.setState({
          toRemove
        });
      }
    }

    computeFilter = (layer: ILayerSpec, toRemove: Set<string>) => {
      return layer.update(
        'filter',
        filter => filter
        // filter.union(List(['!in', 'id', ...toRemove.toArray()]))
      );
    };

    render() {
      return (
        <div>
          <Child
            {...this.props}
            layer={this.computeFilter(this.props.layer, this.state.toRemove)}
          />
        </div>
      );
    }
  };
};
