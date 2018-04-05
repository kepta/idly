import { TemplateResult } from 'lit-html';
import { html } from 'lit-html/lib/lit-extended';

export function TabRow<T extends string>({
  active,
  onChange = () => ({}),
  keys,
}: {
  active: T;
  onChange?: (tab: T) => void;
  keys: T[];
}) {
  return html`
  <div class="tab-row layout horizontal around-justified">
  ${keys.map(
    (t: any) =>
      html`
      <span
        on-click=${() => onChange(t)}
        class$="tab-row-item ${t === active ? 'tab-row-active' : ''}"
      >
        ${t}
      </span>
      `
  )}
  </div>
`;
}

export function TabChildren(content: any) {
  return html`
    <div class="tab-content">${content}</div>
  `;
}

export const Box = ({
  title,
  children,
}: {
  title: any;
  children: any;
}): TemplateResult =>
  html`
  <div class="box layout vertical">
    <div class="title">${title}</div>
    <div class="children">${children}</div>
  </div>
  `;

export function MiniWindow<T extends string>({
  active,
  child,
}: {
  active: T;
  child: any;
}) {
  if (!child) {
    return;
  }
  return html`
  <div>
    <div class="tab-row mini layout horizontal start-justified">
      <span
        class="layout tab-row-item p6l"
      >
        ${active}
      </span>
      <span class="layout flex-3"> </span>
    </div>
    ${TabChildren(child)}
  </div>
`;
}
