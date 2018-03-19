import { TemplateResult } from 'lit-html';
import { html } from 'lit-html/lib/lit-extended';

export function Tabs<T extends string>({
  active,
  onChange,
  content,
}: {
  active: T;
  onChange: (tab: T) => void;
  content: Record<T, any>;
}): TemplateResult {
  return html`
    <div>
      <div class="tab-row layout horizontal around-justified">
        ${Object.keys(content).map(
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
      <div class="tab-content">${content[active]}</div>
    </div>
  `;
}

export const Box = ({ title, children }: { title: any; children: any }) =>
  html`
  <div class="box layout vertical">
    <div class="title">${title}</div>
    <div class="children">${children}</div>
  </div>
  `;
