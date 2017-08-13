import { SOURCES } from 'map/constants';
import { AreaLayer, AreaLayerCasing } from 'map/layers/area';
import { areaBlueLayer, areaBlueLayerCasing } from 'map/layers/area/blue';
import {
  areaBuildingLayer,
  areaBuildingLayerFill
} from 'map/layers/area/building';
import { areaGoldLayer, areaGoldLayerCasing } from 'map/layers/area/gold';
import { areaGrayLayer, areaGrayLayerCasing } from 'map/layers/area/gray';
import { areaGreenLayer, areaGreenLayerCasing } from 'map/layers/area/green';
import {
  areaLightGreenLayer,
  areaLightGreenLayerCasing
} from 'map/layers/area/lightGreen';
import { areaOrangeLayer, areaOrangeLayerCasing } from 'map/layers/area/orange';
import { areaPinkLayer, areaPinkLayerCasing } from 'map/layers/area/pink';
import { areaTanLayer, areaTanLayerCasing } from 'map/layers/area/tan';
import { areaYellowLayer, areaYellowLayerCasing } from 'map/layers/area/yellow';
import { AreaLabelsLayer } from 'map/layers/areaLabels';
import { highwayMotorway } from 'map/layers/highway/motorway';
import {
  highwayNarrow,
  highwayNarrowCasing,
  highwayTrack
} from 'map/layers/highway/narrow';
import { highwayPrimary } from 'map/layers/highway/primary';
import { highwayResidential } from 'map/layers/highway/residential';
import { highwaySecondary } from 'map/layers/highway/secondary';
import {
  highwayTertiary
} from 'map/layers/highway/tertiary';
import { highwayTrunk } from 'map/layers/highway/trunk';
import { highwayUnclassified } from 'map/layers/highway/unclassified';
import { LineLayer } from 'map/layers/line';
import { LineLabelLayer } from 'map/layers/lineLabel';
import { PointsWithLabelsLayer } from 'map/layers/pointsWithLabels';
import { PointsWithoutLabelsLayer } from 'map/layers/pointsWithoutLabel';
import { railway, railwayCasing } from 'map/layers/rail/rail';
import { waterway } from 'map/layers/waterway/waterway';

const source = SOURCES.map(s => s.source);

export const Layers = [
  AreaLayer,
  AreaLayerCasing,
  areaGrayLayer,
  areaGrayLayerCasing,
  areaGreenLayer,
  areaGreenLayerCasing,
  areaLightGreenLayer,
  areaLightGreenLayerCasing,
  areaBlueLayer,
  areaBlueLayerCasing,
  areaYellowLayer,
  areaYellowLayerCasing,
  areaGoldLayer,
  areaGoldLayerCasing,
  areaOrangeLayer,
  areaOrangeLayerCasing,
  areaBuildingLayer,
  areaBuildingLayerFill,
  areaPinkLayer,
  areaPinkLayerCasing,
  areaTanLayer,
  areaTanLayerCasing,
  LineLayer,
  LineLabelLayer,
  highwaySecondary,
  highwayResidential,
  highwayUnclassified,
  highwayTrack,
  highwayNarrow,
  highwayNarrowCasing,
  highwayMotorway,
  highwayTrunk,
  highwayPrimary,
  highwayTertiary,
  railwayCasing,
  railway,
  waterway,
  PointsWithLabelsLayer,
  AreaLabelsLayer,
  PointsWithoutLabelsLayer
];

export const SourceLayered = SOURCES.map(s => Layers.map(l => l(s.source))); // flatten the array

export const SELECTABLE_LAYERS = SourceLayered.reduce(
  (prv, c) => prv.concat(c),
  []
)
  .filter(l => l.selectable)
  .map(l => l.displayName);
console.log(SELECTABLE_LAYERS);
export const LAYERS = SourceLayered.reduce((prv, c) => prv.concat(c), []).map(
  l => l.displayName
);
