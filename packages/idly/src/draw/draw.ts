import MapboxDraw = require('@mapbox/mapbox-gl-draw');

import { setupDraw } from 'draw/draw_setup';
import { observe, store } from 'store/index';
import { attachToWindow } from 'utils/attach_to_window';

export class Draw {
  private draw;
  private unsubscribe;
  private map;
  private dispatch;
  constructor(map) {
    this.unsubscribe = observe(state => state.osmTiles, this.stateChange);
    this.map = map;
    this.draw = setupDraw();
    attachToWindow('draw', this.draw);
    map.addControl(this.draw);
    map.on('click', this.clickHandler);
  }
  private stateChange = change => {};
  private clickHandler = (e: any) => {
    // set bbox as 5px reactangle area around clicked point
    const bbox = [
      [e.point.x - 5, e.point.y - 5],
      [e.point.x + 5, e.point.y + 5]
    ];
    const features = this.map.queryRenderedFeatures(bbox, {
      layers: ['park-volcanoes']
    });
    if (Array.isArray(features) && features[0]) this.draw.add(features[0]);
    console.log(features);
  };
}
