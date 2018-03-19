import { Component } from '../../helpers/Component';
import { workerOperations } from '../../plugin/worker2';
import { State } from '../State';

export interface Props {
  quadkeys?: State['map']['quadkeysData'];
}

export class OsmGeoJSON extends Component<Props, {}, void> {
  protected state = {};

  private pendingRender = 0;
  private setOsmData: (d: any) => void;

  constructor(props: Props, setOsmData: (d: any) => void) {
    super(props);
    this.setOsmData = setOsmData;
  }

  public componentWillUnMount() {
    this.pendingRender = 0;
  }

  protected async render() {
    const q = this.props.quadkeys;

    if (!q) {
      return this.setOsmData({
        type: 'FeatureCollection',
        features: [],
      });
    }
    console.time('workerGetQuadkey');
    const fc = await this.cancellableTask(() => workerOperations.getQuadkey(q));
    console.timeEnd('workerGetQuadkey');

    if (fc) {
      return this.setOsmData(fc);
    }
  }

  protected shouldComponentUpdate(nextProps: Props) {
    if (nextProps.quadkeys !== this.props.quadkeys) {
      return true;
    }
    return false;
  }

  private async cancellableTask<T>(p: () => Promise<T>) {
    this.pendingRender++;

    const counter = this.pendingRender;

    const res = await p();
    if (counter !== this.pendingRender) {
      return;
    }
    return res;
  }
}
