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
    <span class="layer-row">
        <input type="checkbox"
            readonly
            id$=${item.layer.id}
            checked?="${!item.hide}"
            on-click=${() => actions.modifyLayerHide(item.layer.id)}
        >
        <label style="text-transform: capitalize;" for$=${item.layer.id}>
          ${reverseGetNameSpacedLayerId(item.layer.id)
            .split('-')
            .slice(1)
            .join(' ')}
        </label>
    </span>
  `;
}
