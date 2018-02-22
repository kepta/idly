export const areaTemplate: {
  selectable: false;
  priority: 1;
  layer: {
    id: undefined;
    type: 'line';
    source: undefined;
    layout: {
      'line-join': 'round';
      'line-cap': 'round';
    };
    paint: {
      'line-color': '#fff';
      'line-width': 2;
      'line-opacity': 1;
    };
    filter: undefined;
  };
} = {
  selectable: false,
  priority: 1,
  layer: {
    id: undefined,
    type: 'line',
    source: undefined,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#fff',
      'line-width': 2,
      'line-opacity': 1,
    },
    filter: undefined,
  },
};

export const areaCasingTemplate: {
  selectable: false;
  priority: 1;
  layer: {
    id: undefined;
    type: 'line';
    source: undefined;
    layout: {
      'line-join': 'round';
      'line-cap': 'round';
    };
    paint: {
      'line-color': '#fff';
      'line-width': {
        base: 4;
        stops: [[16, 4], [18, 40], [22, 20]];
      };
      'line-opacity': {
        base: 0.2;
        stops: [[16, 0.6], [18, 0.3], [22, 0.4]];
      };
      'line-offset': {
        base: 4;
        stops: [[16, 4], [18, 16], [22, 12]];
      };
      'line-blur': {
        base: 2;
        stops: [[16, 4], [18, 8], [22, 12]];
      };
    };
    filter: undefined;
  };
} = {
  selectable: false,
  priority: 1,
  layer: {
    id: undefined,
    type: 'line',
    source: undefined,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#fff',
      'line-width': {
        base: 4,
        stops: [[16, 4], [18, 40], [22, 20]],
      },
      'line-opacity': {
        base: 0.2,
        stops: [[16, 0.6], [18, 0.3], [22, 0.4]],
      },
      'line-offset': {
        base: 4,
        stops: [[16, 4], [18, 16], [22, 12]],
      },
      'line-blur': {
        base: 2,
        stops: [[16, 4], [18, 8], [22, 12]],
      },
    },
    filter: undefined,
  },
};
