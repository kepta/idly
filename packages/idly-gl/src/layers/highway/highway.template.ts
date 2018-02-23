import { IDLY_NS } from '../../constants';
import { HIGHWAY } from '../priorities';

export const highwayTemplate: {
  selectable: true;
  layer: {
    id: undefined;
    type: 'line';
    source: undefined;
    layout: {
      'line-join': 'round';
      'line-cap': 'round';
    };
    paint: {
      'line-color': '#C0C0C0';
      'line-opacity': 1;
      'line-width': [
        'interpolate',
        ['exponential', 2],
        ['zoom'],
        14,
        4,
        18,
        10,
        20,
        12
      ];
    };
    filter: undefined;
  };
} = {
  selectable: true,
  layer: {
    id: undefined,
    type: 'line',
    source: undefined,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#C0C0C0',
      'line-opacity': 1,
      'line-width': [
        'interpolate',
        ['exponential', 2],
        ['zoom'],
        14,
        4,
        18,
        10,
        20,
        12,
      ],
    },
    filter: undefined,
  },
};

export const highwayCaseTemplate: {
  selectable: false;
  layer: {
    id: undefined;
    type: 'line';
    source: undefined;
    layout: {
      'line-join': 'round';
      'line-cap': 'round';
    };
    paint: {
      'line-color': '#000';
      'line-opacity': 1;
      'line-width': [
        'interpolate',
        ['exponential', 2],
        ['zoom'],
        14,
        6,
        18,
        12,
        20,
        16
      ];
    };
    filter: undefined;
  };
} = {
  selectable: false,
  layer: {
    id: undefined,
    type: 'line',
    source: undefined,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#000',
      'line-opacity': 1,
      'line-width': [
        'interpolate',
        ['exponential', 2],
        ['zoom'],
        14,
        6,
        18,
        12,
        20,
        16,
      ],
    },
    filter: undefined,
  },
};
