import { TemplateResult } from 'lit-html';
import { html } from 'lit-html/lib/lit-extended';

export function TabRow<T extends string>({
  active,
  onChange,
  keys,
}: {
  active: T;
  onChange: (tab: T) => void;
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

// export function Tabs<T extends string>({
//   active,
//   onChange,
//   content,
// }: {
//   active: T;
//   onChange: (tab: T) => void;
//   content: Record<T, any>;
// }): { row: TemplateResult; children: TemplateResult } {
//   return {
//     row: html`
//       <div class="layout horizontal around-justified flex-6">
//       ${Object.keys(content).map(
//         (t: any) =>
//           html`
//           <span
//             on-click=${() => onChange(t)}
//             class$="tab-row-item ${t === active ? 'tab-row-active' : ''}"
//           >
//             ${t}
//           </span>
//           `
//       )}
//       </div>
//     `,
//     children: html`
//        <div class="tab-content">${content[active]}</div>
//     `,
//   };
// }

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
