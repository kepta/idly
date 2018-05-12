import bboxPolygon from '@turf/bbox-polygon';
import { mercator } from 'idly-common/lib/geo';
import { quadkeyToTile } from 'idly-common/lib/misc/quadkeyToTile';
import { Subscription } from 'rxjs/Subscription';
import { GlComp } from '../helpers/GlComp';
import { makeLoadingQuadkeys$ } from '../streams';
import { Subject } from 'rxjs/Subject';

export interface Props {
  quadkeys: string[];
}
export interface State {
  loadingQuadkeys: string[];
}

export class UnloadedTiles extends GlComp<Props, State, any, any> {
  protected loadingQuadkeys: Subscription;
  protected destroy: Subject<void> = new Subject();
  constructor(props: Props, gl: any) {
    super(
      props,
      {
        loadingQuadkeys: [],
      },
      gl,
      'unloaded-layer'
    );

    this.loadingQuadkeys = makeLoadingQuadkeys$(gl, this.destroy).subscribe(q =>
      this.setState({ loadingQuadkeys: q })
    );

    this.mount();
  }

  public componentWillUnMount() {
    this.loadingQuadkeys.unsubscribe();
    super.componentWillUnMount();
    this.destroy.next();
    this.destroy.complete();
  }

  protected render(props: Props, state: State) {
    return {
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: state.loadingQuadkeys
            ? state.loadingQuadkeys
                .filter(
                  q =>
                    !props.quadkeys.find(
                      p => p.startsWith(q) || q.startsWith(p)
                    )
                )
                .map((q: string) => {
                  const f = quadkeyToFeature(q);
                  if (q.endsWith('0') || q.endsWith('3')) {
                    f.properties.lighter = true;
                  }
                  return f;
                })
            : [],
        },
      },
      layers: {
        fill: {
          type: 'fill',
          paint: {
            'fill-color': 'black',
            'fill-outline-color': 'black',
            'fill-opacity': 0.4,
          },
          filter: ['has', 'lighter'],
        },
      },
    };
  }
}

export function quadkeyToFeature(quadkey: string): any {
  const { x, y, z } = quadkeyToTile(quadkey);
  return bboxPolygon(mercator.bbox(x, y, z));
}
