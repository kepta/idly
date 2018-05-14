import { html, TemplateResult } from 'lit-html';
import { LayerOpacity } from '../helpers/layerOpacity';
import { Actions } from '../store/Actions';

// tslint:disable:max-line-length
export const IconBar = ({
  loading,
  actions,
  layerOpacity,
  entityId,
}: {
  actions: Actions;
  loading: boolean;
  layerOpacity: LayerOpacity;
  entityId?: string;
}) => {
  let icon = Icon(LowOpacity, actions.modifyLayerOpacity);

  if (layerOpacity === LayerOpacity.High) {
    icon = Icon(HighOpacity, actions.modifyLayerOpacity);
  } else if (layerOpacity === LayerOpacity.Medium) {
    icon = Icon(MedOpacity, actions.modifyLayerOpacity);
  }

  return html`
      <div class="icon-row layout horizontal start-justified">
          ${icon}
          <span style="font-size: 1.4em;" class="idly-gl-icon layout link vertical">
            <a target="_blank"  class="layout vertical center-center" href="https://github.com/kepta/idly/wiki/User_Guide">?</a>
          </span>
          ${
            loading
              ? Icon(html`
                  <div style="display:inline-block" class="loader" ></div>
              `)
              : Icon(``)
          }
          <span class="flex-6"></span>
          ${entityId ? osmLink(entityId) : osmLink('')}
      </div>
    `;
};

function osmLink(id?: string) {
  if (!id) {
    return;
  }
  let type = '';
  switch (id.charAt(0)) {
    case 'n': {
      type = 'node';
      break;
    }
    case 'w': {
      type = 'way';
      break;
    }
    case 'r': {
      type = 'relation';
      break;
    }
  }

  const href = `https://openstreetmap.org/${type}/${id.substring(1)} `;

  return html`<span style="font-size: 1.1em; padding-right: 6px;" class="idly-gl-icon layout link vertical">
        <a target="_blank"  class="layout vertical center-center" href=${href}>${id}</a>
  </span>`;
}

export const HighOpacity: TemplateResult = html`
    <svg class="svg-icon" viewBox="0 0 20 20">
          <path fill="none" d="M10,0.531c-5.229,0-9.469,4.239-9.469,9.469S4.771,19.469,10,19.469s9.469-4.239,9.469-9.469S15.229,0.531,10,0.531 M11.128,18.525c-0.371,0.049-0.745,0.082-1.128,0.082c-4.754,0-8.608-3.854-8.608-8.607S5.246,1.392,10,1.392c0.383,0,0.758,0.034,1.128,0.083c1.976,2.269,3.176,5.281,3.176,8.525S13.103,16.257,11.128,18.525"></path>
    </svg>
`;

export const MedOpacity = html`
    <svg class="svg-icon" viewBox="0 0 20 20">
         <path fill="none" d="M10,0.625c-5.178,0-9.375,4.197-9.375,9.375S4.822,19.375,10,19.375s9.375-4.197,9.375-9.375S15.178,0.625,10,0.625 M10,18.522V1.478c4.707,0,8.522,3.815,8.522,8.522S14.707,18.522,10,18.522"></path>
     </svg>
`;

export const LowOpacity = html`
  <svg class="svg-icon" viewBox="0 0 20 20">
      <path fill="none" d="M10,0.542c-5.224,0-9.458,4.234-9.458,9.458c0,5.223,4.235,9.459,9.458,9.459c5.224,0,9.458-4.236,9.458-9.459C19.459,4.776,15.225,0.542,10,0.542 M8.923,18.523C4.685,17.992,1.402,14.383,1.402,10c0-4.383,3.283-7.993,7.521-8.524C6.919,3.749,5.701,6.731,5.701,10C5.701,13.27,6.919,16.25,8.923,18.523"></path>
  </svg>
`;

export const SelectIcon = html`
  <svg class="svg-icon" viewBox="0 0 20 20">
      <path d="M17.659,9.597h-1.224c-0.199-3.235-2.797-5.833-6.032-6.033V2.341c0-0.222-0.182-0.403-0.403-0.403S9.597,2.119,9.597,2.341v1.223c-3.235,0.2-5.833,2.798-6.033,6.033H2.341c-0.222,0-0.403,0.182-0.403,0.403s0.182,0.403,0.403,0.403h1.223c0.2,3.235,2.798,5.833,6.033,6.032v1.224c0,0.222,0.182,0.403,0.403,0.403s0.403-0.182,0.403-0.403v-1.224c3.235-0.199,5.833-2.797,6.032-6.032h1.224c0.222,0,0.403-0.182,0.403-0.403S17.881,9.597,17.659,9.597 M14.435,10.403h1.193c-0.198,2.791-2.434,5.026-5.225,5.225v-1.193c0-0.222-0.182-0.403-0.403-0.403s-0.403,0.182-0.403,0.403v1.193c-2.792-0.198-5.027-2.434-5.224-5.225h1.193c0.222,0,0.403-0.182,0.403-0.403S5.787,9.597,5.565,9.597H4.373C4.57,6.805,6.805,4.57,9.597,4.373v1.193c0,0.222,0.182,0.403,0.403,0.403s0.403-0.182,0.403-0.403V4.373c2.791,0.197,5.026,2.433,5.225,5.224h-1.193c-0.222,0-0.403,0.182-0.403,0.403S14.213,10.403,14.435,10.403"></path>
  </svg>
`;

export const Icon = (
  child: TemplateResult | string,
  onClick?: (s: void) => void
) => html`
  <span class="idly-gl-icon layout vertical center-center" on-click=${onClick}>
    ${child}
  </span
`;

export const ButtonLink = (child: TemplateResult | string, href?: string) =>
  html`<span class="link"><a target="_blank" href=${href}>${child}</a></span>`;

export const Button = (child: TemplateResult | string, onClick?: () => void) =>
  html`<span class="link"><a  on-click=${onClick}>${child}</a></span>`;
