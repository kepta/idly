import * as turfHelpers from '@turf/helpers';
import { Manager } from './store/manager';

const manager = new Manager();

type cb = (event: { data: string }) => void;

export interface WebWorker {
  addEventListener: (s: string, cb) => void;
  postMessage: (s: string) => void;
}

export function workerFunction(self: WebWorker) {
  self.addEventListener('message', function(event: { data: string }) {
    const { bbox, zoom } = JSON.parse(event.data);
    manager.receive(bbox, zoom).then(features => {
      self.postMessage(JSON.stringify(turfHelpers.featureCollection(features)));
    });
  });
}
