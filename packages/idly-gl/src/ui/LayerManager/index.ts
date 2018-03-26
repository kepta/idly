import { TemplateResult } from 'lit-html';
import { html } from 'lit-html/lib/lit-extended';
import { repeat } from 'lit-html/lib/repeat';
import { reverseGetNameSpacedLayerId } from '../../helpers/helper';
import { Actions } from '../Actions';
import { Box } from '../helpers';

export function LayerManager(
  glLayers: any[],
  actions: Actions
): TemplateResult {
  return Box({
    title: 'LayerManager',
    children: html`
    <div class="layout vertical">
    ${repeat(
      glLayers.filter(r => !r.internal && !r.layer.id.includes('casing')),
      gl => gl.id,
      (item, index) => {
        const name = reverseGetNameSpacedLayerId(item.layer.id);
        return html`
                <span>
                    <input type="checkbox"
                        id$=${item.layer.id}
                        name$="name-${item.layer.id}"
                        checked?="${!item.hide}"
                        on-click=${() => actions.modifyLayerHide(item.layer.id)}
                    >
                    <label for$=${item.layer.id}> ${name}</label>
                </span>
                `;
      }
    )}
    </div>
    `,
  });
}

function findPairing(glLayers: any[]) {
  // const glLayersLookup = glLayers.reduce((prev, cur) => )
}
