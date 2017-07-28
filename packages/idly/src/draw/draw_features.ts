import { List } from 'immutable';
import * as R from 'ramda';

import { NodeFeature } from 'map/nodeToFeat';

export function DrawFeatures({
  selectedFeatures,
  dirtyDrawAccess,
  selectFeatures
}: {
  selectedFeatures: List<NodeFeature>;
  dirtyDrawAccess: (map: any) => void;
  selectFeatures: any;
}) {
  // const featureCollection = turf.featureCollection(
  //   selectedFeatures.toArray().map(f => ({
  //     ...f,
  //     id: f.properties.id,
  //     geometry: f.geometry
  //   }))
  // );
  // const featureIds = selectedFeatures.toArray().map(f => f.properties.id);
  // /**
  //  * somes times it happens selected features are 0
  //  * need more investigation
  //  */
  // return null;
  // console.log('drawing this featur', featureIds);
  // dirtyDrawAccess(draw => {
  //   const featuresThatWereSelected: List<NodeFeature> = List(
  //     R.uniqBy((a: any) => a.id, draw.getAll().features).map(f => ({
  //       ...f,
  //       id: f.properties.id,
  //       geometry: f.geometry
  //     }))
  //   );
  //   // selectFeatures(null, featuresThatWereSelected);
  //   draw.set(featureCollection);
  //   setTimeout(() => {
  //     draw.changeMode('simple_select', {
  //       featureIds
  //     });
  //   }, 50);
  // });
  // return null;
}
