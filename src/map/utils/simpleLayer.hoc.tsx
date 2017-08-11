import { List, Set } from 'immutable';
import * as React from 'react';

import { hideEntities } from 'map/utils/hideEntities';
import { ILayerSpec } from 'map/utils/layerFactory';
import { Entities } from 'osm/entities/entities';

export type LayerFilter = Set<string | List<string>>;

/**
 * internal state of the HOC
 */
interface IState {
  layerSpec: ILayerSpec;
}

/**
 * configuration for HOC
 */
interface IOptions {
  displayName: string;
  layer: ILayerSpec;
  selectable: boolean;
}

/**
 * are props of the component created by the HOC.
 * They are not passed to the wrapped component.
 * Optional
 */
interface IExternalProps {
  entities: Entities;
  updateLayer: (layerSpec: ILayerSpec) => void;
  removeLayer: (layerId: string) => void;
}

/**
 * Are props that the HOC adds to the wrapped component.
 * They are calculated based on the HOC state and ExternalProps.
 * Might have to export it to the child.
 * Optional
 */

/**
 * ChildCompProps is a generic type which is the prop type
 * of ChildComponent.
 * `ChildCompProps extends {}` is just noise, for the IDE to understand
 * it is a type.
 */
export const simpleLayerHOC = ({
  displayName,
  layer,
  selectable
}: IOptions) => {
  type ResultProps = Readonly<IExternalProps>;
  return class SimpleLayer extends React.PureComponent<ResultProps, IState> {
    static displayName = displayName;
    static selectable = selectable;
    state = {
      layerSpec: layer
    };
    /**
     * @TOFIX lifecycle methods dont really work
     *  the way youwould want them to.
     *  Need better testing for simple update, unmount, mount
     */
    shouldComponentUpdate(nextProps, nextState: IState) {
      return !this.state.layerSpec.equals(nextState.layerSpec);
    }
    componentDidMount() {
      this.props.updateLayer(this.state.layerSpec);
    }
    componentWillReceiveProps(nextProps: ResultProps) {
      const layerSpec = hideEntities(
        this.state.layerSpec,
        this.props.entities,
        nextProps.entities
      );
      this.setState({
        layerSpec
      });
    }
    componentWillUnmount() {
      this.props.removeLayer(this.state.layerSpec.get('id'));
    }

    render() {
      this.props.updateLayer(this.state.layerSpec);
      return null;
    }
  };
};
