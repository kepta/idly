import { TemplateResult } from 'lit-html';
import { html } from 'lit-html/lib/lit-extended';
import { repeat } from 'lit-html/lib/repeat';
import { reverseGetNameSpacedLayerId } from '../helpers/helpers';
import { Layer } from '../layers/types';
import { Actions } from '../store/Actions';

export function LayerManager(
  glLayers: Layer[],
  actions: Actions
): TemplateResult {
  const categorize = glLayers
    .filter(r => !r.internal && !r.layer.id.includes('casing'))
    .reduce(
      (prev, cur) => {
        const name = reverseGetNameSpacedLayerId(cur.layer.id).split('-')[0];
        if (!prev[name]) {
          prev[name] = [];
        }
        prev[name].push(cur);
        return prev;
      },
      {} as Record<string, Layer[]>
    );

  return html`
  <div class="tab-content">
    <div class="layout vertical">
      ${repeat(
        Object.keys(categorize),
        k => k,
        c => html`
            <div class="layout vertical">
              <span
                class="layer-category title"
                style="text-transform: capitalize;"
                on-click=${() => actions.modifyLayerHide(c)}
              >
                ${c}
              </span>
              ${repeat(
                categorize[c],
                l => l.layer.id,
                l => LayerRow(l, actions)
              )}
            </div>
            `
      )}
    </div>
  `;
}

function LayerRow(item: Layer, actions: Actions) {
  return html`
    <span class="layer-row layout horizontal">
        <input type="checkbox"
            readonly
            id$=${item.layer.id}
            checked?="${!item.hide}"
            on-click=${() => actions.modifyLayerHide(item.layer.id)}
        >
        <span class="swatch" style$=${'background-color:' +
          findColor(item)}></span>
        <label style="text-transform: capitalize;" for$=${item.layer.id}>
          ${reverseGetNameSpacedLayerId(item.layer.id)
            .split('-')
            .slice(1)
            .join(' ')}
        </label>
    </span>
    </div>
  `;
}

const defSwatch = '#888';

function findColor(l: Layer) {
  const paint = l.layer.paint;
  if (!paint) {
    return defSwatch;
  }

  const colorProps = [
    'line-color',
    'circle-color',
    'fill-color',
    'text-halo-color',
    'fill-extrusion-color',
  ];

  for (const prop of colorProps) {
    if (paint[prop] && typeof paint[prop] === 'string') {
      return paint[prop];
    }
    if (Array.isArray(paint[prop])) {
      for (const color of paint[prop]) {
        if (
          typeof color === 'string' &&
          color.startsWith('#') &&
          (color.length === 7 || color.length === 4)
        ) {
          return color;
        }
      }
    }
  }

  return defSwatch;
}
