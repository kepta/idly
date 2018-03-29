import { weakCache } from 'idly-common/lib/misc';
import { html } from 'lit-html/lib/lit-extended';
import { IDLY_NS } from '../constants';
import { EntityExpanded, MainTabs, Store } from '../store';
import { Actions } from '../store/Actions';
import { fcLookup } from '../store/map.derived';
import { workerOperations } from '../worker';
import { MiniWindow } from './helpers';
import { Button, ButtonLink, Icon } from './icons';

export async function EntityInfo({
  id,
  fc,
  actions,
}: {
  id?: string;
  fc: Store['map']['featureCollection'];
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

  const osmHref = `https://openstreetmap.org/${entity.type}/${id.substring(
    1
  )} `;

  return html`<div class="entity-info layout vertical">
        <span class="title">${findPresetName(id, fc)}</span>
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

export function findPresetName(
  id: string,
  fc: Store['map']['featureCollection']
) {
  const features = fcLookup(fc).get(id);
  if (!features) {
    return id;
  }
  const name = features
    .filter(f => f.properties && f.properties[`${IDLY_NS}preset-name`])
    .map(f => f.properties && f.properties[`${IDLY_NS}preset-name`])[0];
  return name || id;
}

export const entityTreeString = weakCache((entityTree: EntityExpanded) => {
  return JSON.stringify(entityTree);
});
