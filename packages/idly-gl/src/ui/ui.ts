import { TemplateResult } from 'lit-html';
import { html } from 'lit-html/lib/lit-extended';
import { repeat } from 'lit-html/lib/repeat';
import { LayerOpacity } from '../helpers/layerOpacity';
import { workerOperations } from '../worker';
import { Actions } from './Actions';
import { Box, TabChildren, TabRow } from './helpers';
import { LayerManager } from './LayerManager';
import { MainTabs, State } from './State';
import { Style } from './Style';

export const Ui = ({
  mainTab,
  selectEntity: { selectedId, hoverId },
  layerOpacity,
  loading,
  actions,
  layers,
}: {
  mainTab: State['mainTab'];
  selectEntity: State['selectEntity'];
  layerOpacity: LayerOpacity;
  loading: boolean;
  actions: Actions;
  layers: any[];
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
      ${TabChildren(children)}
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
  let opacIcon;
  if (layerOpacity === LayerOpacity.High) {
    opacIcon = html`
       <svg class="svg-icon" viewBox="0 0 20 20">
				 <path fill="none" d="M10,0.531c-5.229,0-9.469,4.239-9.469,9.469S4.771,19.469,10,19.469s9.469-4.239,9.469-9.469S15.229,0.531,10,0.531 M11.128,18.525c-0.371,0.049-0.745,0.082-1.128,0.082c-4.754,0-8.608-3.854-8.608-8.607S5.246,1.392,10,1.392c0.383,0,0.758,0.034,1.128,0.083c1.976,2.269,3.176,5.281,3.176,8.525S13.103,16.257,11.128,18.525"></path>
			</svg>
      `;
  } else if (layerOpacity === LayerOpacity.Medium) {
    opacIcon = html`
      <svg class="svg-icon" viewBox="0 0 20 20">
				<path fill="none" d="M10,0.625c-5.178,0-9.375,4.197-9.375,9.375S4.822,19.375,10,19.375s9.375-4.197,9.375-9.375S15.178,0.625,10,0.625 M10,18.522V1.478c4.707,0,8.522,3.815,8.522,8.522S14.707,18.522,10,18.522"></path>
			</svg>
      `;
  } else {
    opacIcon = html`
       <svg class="svg-icon" viewBox="0 0 20 20">
			  <path fill="none" d="M10,0.542c-5.224,0-9.458,4.234-9.458,9.458c0,5.223,4.235,9.459,9.458,9.459c5.224,0,9.458-4.236,9.458-9.459C19.459,4.776,15.225,0.542,10,0.542 M8.923,18.523C4.685,17.992,1.402,14.383,1.402,10c0-4.383,3.283-7.993,7.521-8.524C6.919,3.749,5.701,6.731,5.701,10C5.701,13.27,6.919,16.25,8.923,18.523"></path>
			 </svg>
      `;
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
      ${opacIcon}
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
              <span class="tags-key">${r}</span>
              <span class="tags-value">${t[r]}</span>
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
