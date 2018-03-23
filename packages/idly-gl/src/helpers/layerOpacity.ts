export const enum LayerOpacity {
  High = 1,
  Medium = 0.7,
  Low = 0.3,
}

export function layerOpacity(
  newOp: LayerOpacity,
  prevOp: LayerOpacity,
  layers: any[]
) {
  return layers.map(l => {
    let paint = l.paint;
    if (!l.type) {
      return l;
    }
    if (!paint) {
      const keys = findOpacity(l.type);
      paint = {};
      for (const k of keys) {
        paint[k] = 1;
      }
    }

    if (paint) {
      paint = { ...paint };

      for (const k of findOpacity(l.type)) {
        const value = paint[k];
        if (!value) {
          paint[k] = applyRatio(1, newOp / prevOp);
          continue;
        }
        if (value && value.base) {
          value.base = applyRatio(value.base, newOp / prevOp);
          continue;
        }

        if (typeof value === 'number') {
          paint[k] = applyRatio(value, newOp / prevOp);
        }
      }
    }

    l.paint = paint;
    return l;
  });
}

function applyRatio(n: any, multiplyBy: number) {
  if (typeof n === 'number' && !Number.isNaN(n)) {
    return n * multiplyBy;
  }
  return n;
}

function findOpacity(type: string) {
  switch (type) {
    case 'background':
      return ['background-opacity'];

    case 'fill':
      return ['fill-opacity'];

    case 'line':
      return ['line-opacity'];

    case 'symbol':
      return ['icon-opacity', 'text-opacity'];

    case 'raster':
      return ['raster-opacity'];

    case 'circle':
      return ['circle-opacity', 'circle-stroke-opacity'];

    case 'fill-extrusion':
      return ['fill-extrusion-opacity'];

    case 'heatmap':
      return ['heatmap-opacity'];

    default:
      return [];
  }
}
