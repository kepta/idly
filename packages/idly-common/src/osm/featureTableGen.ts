import { GeometryObject } from 'geojson';
import { Map as ImMap } from 'immutable';
import { Feature, FeatureTable } from './feature';

export function featureTableGen<
  T extends GeometryObject,
  K extends { [index: string]: boolean | string | number | null | undefined }
>(features: Array<Feature<T, K>>, featureTable: FeatureTable<T, K> = ImMap()) {
  return featureTable.withMutations(ft => {
    for (const feature of features) {
      let id = feature.id && feature.properties.id;
      if (id == null) {
        continue;
      }
      if (typeof id === 'number') {
        id = id.toString();
      }
      if (typeof id !== 'string') {
        continue;
      }
      if (ft.has(id)) {
        continue;
      }
      ft.set(id, feature);
    }
  });
}
