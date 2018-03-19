import { html } from 'lit-html/lib/lit-extended';
import { workerOperations } from '../plugin/worker2';
import { Box, Tabs } from './helpers';
import { MainTabs, State } from './State';

const styleEl = `
<style>

</style>
`;

export const Ui = ({
  mainTab,
  selectEntity: { selectedId, hoverId },
  changeMainTab,
}: {
  mainTab: State['mainTab'];
  selectEntity: State['selectEntity'];
  changeMainTab: (b: string) => void;
}) => {
  const tabs = Tabs<MainTabs>({
    active: mainTab.active,
    onChange: changeMainTab,
    content: {
      [MainTabs.Tags]: Box({
        title: selectedId,
        children: Tags({ id: selectedId || hoverId }),
      }),
      [MainTabs.Presets]: html`<span class="">Here lies the might presets </span>`,
      [MainTabs.Relations]: Box({
        title: selectedId,
        children: Tags({ id: selectedId || hoverId }),
      }),
    },
  });

  return html`
    <div class="mapboxgl-ctrl">
      <div class="container idly-gl layout vertical">
        ${tabs}
      </div>
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

// const relations = async (id = '') => {
//   const data = await workerOperations.getEntity({ id });

//   const t = data ? data.tags : {};

//   return (
//     class as div="tags-box">
//       {Object.keys(t).map(r => (
//         key as div={r} class="tags-item layout vertical">
//           class as span="tags-key">{r}</span>
//           <span class="tags-value">{t[r]}</span>
//         </div>
//       ))}
//     < /div>
//   );
// };
