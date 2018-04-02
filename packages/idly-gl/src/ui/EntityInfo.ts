import { html } from 'lit-html/lib/lit-extended';
import { MainTabs } from '../store';
import { Actions } from '../store/Actions';
import { workerOperations } from '../worker';
import { Button, ButtonLink } from './icons';

export async function EntityInfo({
  id,
  actions,
}: {
  id?: string;
  actions: Actions;
  peak?: boolean;
}): Promise<any> {
  if (!id) {
    return;
  }
  const entity = await workerOperations.getEntity({ id });

  if (!entity) {
    return;
  }

  const { preset } = await workerOperations.getEntityMetadata({ id });
  const osmHref = `https://openstreetmap.org/${entity.type}/${id.substring(
    1
  )} `;

  const presetName = preset ? preset.name : id;

  return html`<div class="entity-info layout vertical">
        <span class="title">${presetName}</span>
        <div class="p3x layout vertical">
         <span>ID: ${id.substring(1)}</span>
         <span>Type: ${entity.type}</span>
         <span>Changeset: ${entity.attributes.changeset}</span>
         <span class="layout horizontal">
           ${ButtonLink('OSM', osmHref)}
           <span class="flex-1"></span>
           ${Button('Select', () => {
             actions.selectId(id);
             actions.modifyHoverId(undefined);
           })}
           <span class="flex-1"></span>
           ${Button('Tags', () => {
             actions.selectId(id);
             actions.modifyHoverId(undefined);
             actions.modifyMainTab(MainTabs.Tags);
           })}
           <span class="flex-3"></span>
           <span class="flex-3"></span>
         </span>
        </div>
    </div>
 `;
}
