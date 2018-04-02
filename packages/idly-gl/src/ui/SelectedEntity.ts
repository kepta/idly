import { html } from 'lit-html';
import { Store } from '../store';

export function SelectedEntity({
  id = '',
}: {
  id?: string;
  fc: Store['map']['featureCollection'];
}): any {
  return html`<div class="tab-row mini layout horizontal around-justified">
    <span
      class="layout layout vertical center-center tab-row-item"
    >
    ${osmLink(id)}
    </span>
    <span class="layout flex-3"> </span>
  </div>`;
}

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

  return html`<span class="idly-gl-icons link layout vertical center-center"}>
          <a target="_blank"  href=${href}>${id}</a>
    </span>`;
}
