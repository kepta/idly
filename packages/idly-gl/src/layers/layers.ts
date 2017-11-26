import { SOURCES } from '../constants';
import { AreaLayer, AreaLayerCasing } from '../layers/area';
import { areaBlueLayer, areaBlueLayerCasing } from '../layers/area/blue';
import {
  areaBuildingLayer,
  areaBuildingLayerFill
} from '../layers/area/building';
import { areaGoldLayer, areaGoldLayerCasing } from '../layers/area/gold';
import { areaGrayLayer, areaGrayLayerCasing } from '../layers/area/gray';
import { areaGreenLayer, areaGreenLayerCasing } from '../layers/area/green';
import {
  areaLightGreenLayer,
  areaLightGreenLayerCasing
} from '../layers/area/lightGreen';
import { areaOrangeLayer, areaOrangeLayerCasing } from '../layers/area/orange';
import { areaPinkLayer, areaPinkLayerCasing } from '../layers/area/pink';
import { areaTanLayer, areaTanLayerCasing } from '../layers/area/tan';
import { areaYellowLayer, areaYellowLayerCasing } from '../layers/area/yellow';
import { AreaLabelsLayer } from '../layers/areaLabels';
import { highwayMotorway } from '../layers/highway/motorway';
import {
  highwayNarrow,
  highwayNarrowCasing,
  highwayTrack
} from '../layers/highway/narrow';
import { highwayPrimary } from '../layers/highway/primary';
import { highwayResidential } from '../layers/highway/residential';
import { highwaySecondary } from '../layers/highway/secondary';
import { highwayTertiary } from '../layers/highway/tertiary';
import { highwayTrunk } from '../layers/highway/trunk';
import { highwayUnclassified } from '../layers/highway/unclassified';
import { LineLayer } from '../layers/line';
import { LineLabelLayer } from '../layers/lineLabel';
import { PointsWithLabelsLayer } from '../layers/pointsWithLabels';
import { PointsWithoutLabelsLayer } from '../layers/pointsWithoutLabel';
import { railway, railwayCasing } from '../layers/rail/rail';
import { waterway } from '../layers/waterway/waterway';

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
export const LAYERS = SourceLayered.reduce((prv, c) => prv.concat(c), []).map(
  l => l.displayName
);
