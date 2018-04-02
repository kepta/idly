import { TemplateResult } from 'lit-html';
import { html } from 'lit-html/lib/lit-extended';
import { LayerOpacity } from '../helpers/layerOpacity';
import { Layer } from '../layers/types';
import { Actions } from '../store/Actions';
import { MainTabs, Store } from '../store/index';
import { workerOperations } from '../worker';
import { EntityInfo } from './EntityInfo';
import { EntityTree, entityTreeString } from './EntityTree';
import { MiniWindow, TabRow } from './helpers';
import { IconBar } from './icons';
import { LayerManager } from './LayerManager';
import { Style } from './Style';

export const Ui = ({
  mainTab,
  selectEntity: { selectedId, hoverId },
  layerOpacity,
  loading,
  actions,
  layers,
  entityTree,
}: {
  mainTab: Store['mainTab'];
  selectEntity: Store['selectEntity'];
  layerOpacity: LayerOpacity;
  loading: boolean;
  actions: Actions;
  layers: Layer[];
  entityTree: Store['entityTree'];
}): TemplateResult => {
  let children;
  let miniWindow;
  switch (mainTab.active) {
    case MainTabs.Tags: {
      children = Tags({ id: selectedId || hoverId });
      break;
    }
    case MainTabs.Tree: {
      children = html`
      <div class="tab-content">
        ${EntityTree({
          selectedId,
          hoverId,
          entityTree,
          actions,
        })}
      </div>
      `;
      miniWindow =
        hoverId &&
        hoverId !== selectedId &&
        entityTree &&
        entityTreeString(entityTree).includes(hoverId)
          ? MiniWindow({
              active: 'Peak',
              child: EntityInfo({ actions, id: hoverId }),
            })
          : null;
      break;
    }
    case MainTabs.Info: {
      children = html`
      <div class="tab-content">
        ${EntityInfo({ actions, id: selectedId || hoverId })}
      </div>
      `;
      break;
    }
    case MainTabs.Layers: {
      children = LayerManager(layers, actions);
      break;
    }
  }

  return html`
    <div class="mapboxgl-ctrl idly-gl">
      ${Style}
      <div class="container  layout vertical ">
          ${IconBar({
            loading,
            actions,
            layerOpacity,
            entityId: selectedId || hoverId,
          })}
          ${TabRow({
            active: mainTab.active,
            onChange: actions.modifyMainTab,
            keys: [
              MainTabs.Info,
              MainTabs.Tags,
              MainTabs.Tree,
              MainTabs.Layers,
            ],
          })}
         ${children}
        ${miniWindow}
      </div>
    </div>
  `;
};

const Tags = async ({ id = '' }: { id?: string }) => {
  const data = await workerOperations.getEntity({ id });
  const t = data ? data.tags : {};

  return html`
    <div class="tags tab-content">
      <div class="tags-box">
        ${Object.keys(t).map(
          r =>
            html`
              <div class="tags-item layout vertical p3x">
                <span class="tags-key title">${r}</span>
                <span class="tags p3x">${t[r]}</span>
              </div>
            `
        )}
      </div>
    </div>
  `;
};
