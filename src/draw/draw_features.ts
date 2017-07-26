import { List } from 'immutable';

import { NodeFeature } from 'map/nodeToFeat';

export function DrawFeatures({
  selectedFeatures,
  dirtyDrawAccess
}: {
  selectedFeatures: List<NodeFeature>;
  dirtyDrawAccess: (map: any) => void;
}) {
  const featureCollection = turf.featureCollection(
    selectedFeatures.toArray().map(f => ({
      ...f,
      id: f.properties.id,
      geometry: f.geometry
    }))
  );
  const featureIds = selectedFeatures.toArray().map(f => f.properties.id);
  dirtyDrawAccess(draw => {
    draw.trash();
    draw.set(featureCollection);
    draw.changeMode('simple_select', {
      featureIds
    });
  });
  return null;
}
