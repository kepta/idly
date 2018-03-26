const lineWidth = [
  'interpolate',
  ['exponential', 2],
  ['zoom'],
  14,
  4,
  18,
  10,
  20,
  12,
];
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
      'line-width': makeLineWidth(),
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
      'line-width': makeLineWidth(1.3),
    },
    filter: undefined,
  },
};

export function makeLineWidth(factor = 1) {
  return [
    ...lineWidth.slice(0, 3),
    ...(lineWidth.slice(3) as number[]).map(
      (r, i) => (i % 2 === 0 ? r : r * factor)
    ),
  ];
}
