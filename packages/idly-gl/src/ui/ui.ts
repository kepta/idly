import { TemplateResult } from 'lit-html';
import { html } from 'lit-html/lib/lit-extended';
import { repeat } from 'lit-html/lib/repeat';
import { LayerOpacity } from '../helpers/layerOpacity';
import { Layer } from '../layers/types';
import { Actions } from '../store/Actions';
import { MainTabs, Store } from '../store/index';
import { workerOperations } from '../worker';
import { Box, TabChildren, TabRow } from './helpers';
import { HighOpacity, LowOpacity, MedOpacity } from './icons';
import { LayerManager } from './LayerManager';
import { Style } from './Style';

export const Ui = ({
  mainTab,
  selectEntity: { selectedId, hoverId },
  layerOpacity,
  loading,
  actions,
  layers,
}: {
  mainTab: Store['mainTab'];
  selectEntity: Store['selectEntity'];
  layerOpacity: LayerOpacity;
  loading: boolean;
  actions: Actions;
  layers: Layer[];
}): TemplateResult => {
  let children;

  switch (mainTab.active) {
    case MainTabs.Tags: {
      children = Box({
        title: selectedId,
        children: Tags({ id: selectedId || hoverId }),
      });
      break;
    }

    case MainTabs.Relations: {
      children = Box({
        title: selectedId,
        children: Relations({
          id: selectedId || hoverId,
          actions,
        }),
      });
      break;
    }
    case MainTabs.Layers: {
      children = LayerManager(layers, actions);
      break;
    }
  }

  return html`
    <div class="mapboxgl-ctrl">
      ${Style}
      <div class="container idly-gl layout vertical ">
          ${IconBar({ loading, actions, layerOpacity })}
            ${TabRow({
              active: mainTab.active,
              onChange: actions.modifyMainTab,
              keys: [MainTabs.Layers, MainTabs.Relations, MainTabs.Tags],
            })}
        <div style="margin:0 6px;">
        ${TabChildren(children)}
        </div>
      </div>
    </div>;
  `;
};

const IconBar = ({
  loading,
  actions,
  layerOpacity,
}: {
  actions: Actions;
  loading: boolean;
  layerOpacity: LayerOpacity;
}) => {
  let Icon = LowOpacity;

  if (layerOpacity === LayerOpacity.High) {
    Icon = HighOpacity;
  } else if (layerOpacity === LayerOpacity.Medium) {
    Icon = MedOpacity;
  }

  return html`
    <div class="icon-row  layout horizontal around-justified">
      ${
        loading
          ? html`
            <div style="padding-top:2px">
              <div style="display:inline-block" class="loader" ></div>
            </div>
          `
          : undefined
      }
      <span class="layout vertical center-center" on-click=${
        actions.modifyLayerOpacity
      }>
        ${Icon}
      </span>
    </div>
  `;
};

const Tags = async ({ id = '' }: { id?: string }) => {
  const data = await workerOperations.getEntity({ id });
  const t = data ? data.tags : {};

  return html`
    <div class="tags-box">
      ${Object.keys(t).map(
        r =>
          html`
            <div class="tags-item layout vertical">
              <span class="tags-key title">${r}</span>
              <span class="tags">${t[r]}</span>
            </div>
          `
      )}
    </div>
  `;
};

const Relations = async ({
  id = '',
  actions,
}: {
  id?: string;
  actions: Actions;
}) => {
  const data = await workerOperations.getDerived({ id });
  const t: string[] = data.derived ? data.derived.parentRelations : [];

  return html`
    <div class="tags-box">
    ${repeat(
      t,
      item =>
        html`
            <div class="tags-item layout vertical" >
              <span class="tags-key">${item}</span>
              <span class="tags-value"
                on-click=${(_: Event) => {
                  actions.modifySelectedId(item);
                }}>${item}</span>
            </div>
        `
    )}
    </div>
  `;
};
