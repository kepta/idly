import { weakCache } from 'idly-common/lib/misc';
import { EntityType } from 'idly-common/lib/osm/structures';
import { HighlightColor } from 'idly-common/lib/styling/highlight';
import { TemplateResult } from 'lit-html';
import { html } from 'lit-html/lib/lit-extended';
import { repeat } from 'lit-html/lib/repeat';
import { EntityExpanded, RecursiveRecord, Store } from '../store';
import { Actions } from '../store/Actions';
import { workerOperations } from '../worker';
import { Icon, SelectIcon } from './icons';

export async function EntityTree({
  entityTree,
  selectedId,
  hoverId,
  actions,
  depth = 0,
}: {
  entityTree: Store['entityTree'];
  selectedId?: string;
  hoverId?: string;
  actions: Actions;
  depth?: number;
}): Promise<TemplateResult | void> {
  if (!entityTree) {
    return;
  }

  console.count('relation');
  const parentRelations = entityTree.parentRelations;
  const parentWays = entityTree.parentWays;
  const children = entityTree.children;

  let childrenLabel = 'Members';
  if (entityTree.entity.type === EntityType.WAY) {
    childrenLabel = 'Nodes';
  }
  return html`
        <div class="tree layout vertical"  style$=${`margin-left:${depth *
          8}px`}>
          ${TreeBranch(
            'Parent Ways',
            parentWays,
            actions,
            depth,
            selectedId,
            hoverId
          )}
          ${TreeBranch(
            'Parent Relations',
            parentRelations,
            actions,
            depth,
            selectedId,
            hoverId
          )}
          ${TreeBranch(
            childrenLabel,
            children,
            actions,
            depth,
            selectedId,
            hoverId
          )}
        </div>
    `;
}

function TreeBranch(
  title: string,
  parent: RecursiveRecord,
  actions: Actions,
  depth: number,
  selectedId?: string,
  hoverId?: string
) {
  const keys = Object.keys(parent);
  if (keys.length === 0) {
    return;
  }
  return html`
    <div class="title">${title}</div>
      ${repeat(
        Object.keys(parent),
        p => p,
        item => {
          const val = parent[item];
          if (typeof val === 'string' || val == null) {
            return html`
                 ${TreeLeaf({
                   id: item,
                   selected: selectedId === item,
                   expanded: false,
                   hovered: hoverId === item,
                   unavailable: val == null,
                   parent,
                   actions,
                 })}
             `;
          }

          return html`
                 ${TreeLeaf({
                   id: item,
                   selected: selectedId === item,
                   hovered: hoverId === item,
                   expanded: true,
                   parent,
                   actions,
                 })}
                 ${EntityTree({
                   entityTree: val,
                   selectedId,
                   hoverId,
                   actions,
                   depth: depth + 1,
                 })}
           `;
        }
      )}
  `;
}

export const entityTreeString = weakCache((entityTree: EntityExpanded) => {
  return JSON.stringify(entityTree);
});

function TreeLeaf({
  id,
  expanded,
  hovered,
  selected,
  parent,
  unavailable,
  actions,
}: {
  id: string;
  selected: boolean;
  expanded: boolean;
  hovered: boolean;
  parent: RecursiveRecord;
  actions: Actions;
  unavailable?: boolean;
}): any {
  return html`
    <a
    title$=${unavailable ? 'Not loaded' : ''}
      class$=${`tree-row justified layout horizontal ${unavailable &&
        'unavailable'} ${expanded && 'active'}`}
      on-click=${(e: Event) => {
        e.stopPropagation();
        actions.modifyHoverId(id);
      }}>
      <span on-click=${async (e: Event) => {
        e.stopPropagation();

        const d = await workerOperations.getEntityMetadata({ id }).then(r => r);

        if (!expanded) {
          actions.addEntityTreeExpand(id, d, parent);
        } else {
          actions.addEntityTreeCollapse(d, parent);
        }
      }}>
          ${expanded ? html`&#9660;` : html`&#9658;`}
      </span>
      <span>&nbsp;${id}</span>
      <span>${unavailable ? ' Unavailable' : ''}</span>
      ${
        selected
          ? html`<span class="swatch circular" style$=${'background-color:' +
              HighlightColor.KIND_SELECTION}></span>`
          : null
      }
      ${
        hovered
          ? html`<span class="swatch circular" style$=${'background-color:' +
              HighlightColor.KIND_HOVER}></span>`
          : null
      }
      <span class="layout flex-2">&nbsp;</span>
      ${
        !unavailable
          ? Icon(SelectIcon, () => {
              actions.selectId(id);
            })
          : ''
      }

    </a>
 `;
}
