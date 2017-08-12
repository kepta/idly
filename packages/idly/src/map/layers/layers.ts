import { SOURCES } from 'map/constants';
import { AreaLayer } from 'map/layers/area';
import { AreaLabelsLayer } from 'map/layers/areaLabels';
import {
  highwayMotorway,
  highwayMotorwayCasing
} from 'map/layers/highway/motorway';
import {
  highwayNarrow,
  highwayNarrowCasing,
  highwayTrack
} from 'map/layers/highway/narrow';
import { highwayPrimary } from 'map/layers/highway/primary';
import { highwayResidential } from 'map/layers/highway/residential';
import { highwaySecondary } from 'map/layers/highway/secondary';
import {
  highwayTertiary,
  highwayTertiaryCasing
} from 'map/layers/highway/tertiary';
import { highwayTrunk } from 'map/layers/highway/trunk';
import { highwayUnclassified } from 'map/layers/highway/unclassified';
import { LineLayer } from 'map/layers/line';
import { LineLabelLayer } from 'map/layers/lineLabel';
import { PointsWithLabelsLayer } from 'map/layers/pointsWithLabels';
import { PointsWithoutLabelsLayer } from 'map/layers/pointsWithoutLabel';
import { railway, railwayCasing } from 'map/layers/rail/rail';

const source = SOURCES.map(s => s.source);

export const Layers = [
  AreaLayer,
  LineLayer,
  highwayTertiaryCasing,
  LineLabelLayer,
  highwaySecondary,
  highwayResidential,
  highwayUnclassified,
  highwayTrack,
  highwayNarrow,
  highwayNarrowCasing,
  highwayMotorway,
  highwayMotorwayCasing,
  highwayTrunk,
  highwayPrimary,
  highwayTertiary,
  railwayCasing,
  railway,
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
