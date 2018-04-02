import { html } from 'lit-html/lib/lit-extended';
import { Actions } from '../store/Actions';
import { workerOperations } from '../worker';

export function SelectorPopup(ids: string[], actions: Actions): any {
  return html`<div class=" layout vertical p3x">
       <span class="layout vertical p3x">
                ${ids.map(
                  id =>
                    html`<span class="link">
                       ${AvailableOption(id, actions)}
                    </span>`
                )}
       </span>
    </div>
 `;
}

async function AvailableOption(id: string, actions: Actions) {
  const misc = await workerOperations.getEntityMetadata({ id });
  let name = id;
  if (misc.preset && misc.preset.name) {
    name = `${id} (${misc.preset.name})`;
  }
  return html`<a
        class="select-entity-popup"
        on-click=${() => actions.selectId(id)}>
        ${name}
    </a>`;
}
