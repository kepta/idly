import { List, Set } from 'immutable';
import * as React from 'react';

import { BaseFilter } from 'map/layers/baseFilter';
import { setSubtractEntities } from 'map/utils/setSubtract';
import { Layer } from 'mapbox-gl';
import { Entities, Entity } from 'osm/entities/entities';
import { getComponentName } from 'utils/getComponentName';

export type LayerFilter = Set<string | List<string>>;

/**
 * internal state of the HOC
 */
interface IState {
  clickCount: number;
}

/**
 * configuration for HOC
 */
interface IOptions {
  debug?: boolean;
}

/**
 * are props of the component created by the HOC.
 * They are not passed to the wrapped component.
 * Optional
 */
interface IExternalProps {
  magical?: boolean;
}

/**
 * Are props that the HOC adds to the wrapped component.
 * They are calculated based on the HOC state and ExternalProps.
 * Might have to export it to the child.
 * Optional
 */
interface IInjectedProps {
  clickCount: number;
}

/**
 * ChildCompProps is a generic type which is the prop type
 * of ChildComponent.
 * `ChildCompProps extends {}` is just noise, for the IDE to understand
 * it is a type.
 */
export const templateHOC = (options: IOptions) => <ChildCompProps extends {}>(
  Child:
    | React.ComponentClass<ChildCompProps & IInjectedProps>
    | React.StatelessComponent<ChildCompProps & IInjectedProps>
) => {
  type ResultProps = ChildCompProps & IExternalProps;
  return class BaseLayer extends React.PureComponent<ResultProps, IState> {
    static displayName = `templateHOC-${getComponentName(Child)}`;
    state = {
      clickCount: 0
    };
    render() {
      return (
        <div>
          <Child {...this.props} {...this.state} />
        </div>
      );
    }
  };
};
