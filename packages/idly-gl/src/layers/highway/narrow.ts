import { IDLY_NS } from '../../constants';
import { HIGHWAY } from '../priorities';
import {
  highwayCaseTemplate,
  highwayTemplate,
  makeLineWidth,
} from './highway.template';

const secBlueFilter = [
  'all',
  ['==', `${IDLY_NS}tag-highway`, 'tag-highway-cycleway'],
];

// TOFIX footpath part of area http://localhost:8080/#18.58/40.7309554/-73.9981163
// should show green but doesn't

const highblue = [
  {
    selectable: true,
    priority: HIGHWAY.ZERO,
    layer: {
      id: 'highblueNarrow',
      type: 'line',
      source: undefined,
      layout: {
        ...highwayTemplate.layer.layout,
        'line-cap': 'square',
      },
      paint: {
        ...highwayTemplate.layer.paint,
        'line-color': '#58a9ed',
        'line-dasharray': [3, 3],
        'line-width': makeLineWidth(0.35),
      },
      filter: ['all', ['==', `${IDLY_NS}geometry`, 'line'], secBlueFilter],
    },
  },
  {
    selectable: false,
    priority: HIGHWAY.MINUS_1,
    layer: {
      id: 'highblueNarrowCasing',
      type: 'line',
      source: undefined,
      layout: highwayCaseTemplate.layer.layout,
      paint: {
        ...highwayCaseTemplate.layer.paint,
        'line-width': makeLineWidth(0.45),
      },
      filter: ['all', ['==', `${IDLY_NS}geometry`, 'line'], secBlueFilter],
    },
  },
];

const secGreenFilter = [
  'any',
  [
    'in',
    `${IDLY_NS}tag-highway`,
    'tag-highway-corridor',
    'tag-highway-pedestrian',
  ],
  ['has', `${IDLY_NS}tag-pedestrian`],
  ['has', `${IDLY_NS}tag-corridor`],
];

const highgreen = [
  {
    selectable: true,
    priority: HIGHWAY.ZERO,
    layer: {
      id: 'highgreenNarrow',
      type: 'line',
      source: undefined,
      layout: {
        ...highwayTemplate.layer.layout,
        'line-cap': 'round',
      },
      paint: {
        ...highwayTemplate.layer.paint,
        'line-color': '#8cd05f',
        'line-dasharray': [3, 3],
        'line-width': makeLineWidth(0.35),
      },
      filter: ['all', ['==', `${IDLY_NS}geometry`, 'line'], secGreenFilter],
    },
  },
  {
    selectable: false,
    priority: HIGHWAY.MINUS_1,
    layer: {
      id: 'highgreenNarrowCasing',
      type: 'line',
      source: undefined,
      layout: highwayCaseTemplate.layer.layout,
      paint: {
        ...highwayCaseTemplate.layer.paint,
        'line-width': makeLineWidth(0.45),
      },
      filter: ['all', ['==', `${IDLY_NS}geometry`, 'line'], secGreenFilter],
    },
  },
];

const filter = [
  'in',
  `${IDLY_NS}tag-highway`,
  'tag-highway-path',
  'tag-highway-footway',
  'tag-highway-bridleway',
];

export default [
  {
    selectable: true,
    priority: HIGHWAY.ZERO,
    layer: {
      id: 'highwayNarrow',
      type: 'line',
      source: undefined,
      layout: {
        ...highwayTemplate.layer.layout,
        'line-cap': 'square',
      },
      paint: {
        ...highwayTemplate.layer.paint,
        'line-color': '#c5b59f',
        'line-dasharray': [3, 3],
        'line-width': makeLineWidth(0.35),
      },
      filter: ['all', ['==', `${IDLY_NS}geometry`, 'line'], filter],
    },
  },
  {
    selectable: false,
    priority: HIGHWAY.MINUS_1,
    layer: {
      id: 'highwayNarrowCasing',
      type: 'line',
      source: undefined,
      layout: highwayCaseTemplate.layer.layout,
      paint: {
        ...highwayCaseTemplate.layer.paint,
        'line-width': makeLineWidth(0.45),
      },
      filter: ['all', ['==', `${IDLY_NS}geometry`, 'line'], filter],
    },
  },
  ...highblue,
  ...highgreen,
];
