import { iterableFlattenToSet, mapFilter, setCreate } from '../helper';
import {
  OneToManyTable,
  oneToManyTableCreate,
  oneToManyTableFilter,
  oneToManyTableUpdateIndex,
  tableFindKey,
  tableForEach,
  tableRemove,
} from '../table';
import { tableAdd, tableValues } from '../table/regular';

export type QuadkeysTable = OneToManyTable<string>;

/**
 * All the modifiedIds are stored in the
 * global root '' quadkey, the virgin Ids are always
 * stored in whatever quadkey they came from. The
 * advantage being modifiedIds being available for render
 * at all times.
 */

export function quadkeysTableAdd(
  t: QuadkeysTable,
  entityIds: string[],
  quadkey: string
) {
  if (ancestorProperFind(t, quadkey)) {
    console.log(
      'warning, ' +
        quadkey +
        'already has an ancestor =' +
        ancestorProperFind(t, quadkey)
    );
    return;
  }

  // since root quadkey is root of all, we just
  //  to append modifiedIds to the root quadkey
  if (quadkey === '') {
    oneToManyTableUpdateIndex(t, quadkey, entityIds);
    return;
  }

  // removes any descendant in favour of the parent quadkey

  removeAllDescendants(t, quadkey);

  tableAdd(t, quadkey, setCreate(entityIds));
}

export function removeAllDescendants(t: QuadkeysTable, quadkey: string) {
  tableForEach((_, id) => {
    if (isQuadkeyDescendant(quadkey, id)) {
      tableRemove(t, id);
    }
  }, t);
}

export const quadkeysTableCreate = (): QuadkeysTable => oneToManyTableCreate();

// @TOFIX with our removeAllDescendants here I think we will always have
// a flat system of quadkeys so this function can simplified to just returning
// a Map with a single quakey & the '' key. But we need to make sure we dont
// add a descendant, because removeAllDescendants will not remove any parent.
export const quadkeysTableCreateFrom = (t: QuadkeysTable, quadkey: string) =>
  mapFilter((_, k) => isQuadkeyRelated(quadkey, k), t);

export const quadkeysTableFlatten = (t: QuadkeysTable) =>
  iterableFlattenToSet(tableValues(t));

// Finds the virginIds assuming all modified Ids stay in '' quadkey
export const quadkeysTableFindVirginIds = (
  t: QuadkeysTable,
  quadkeys: string[]
): Set<string> =>
  quadkeys.some(q => q === '')
    ? setCreate()
    : iterableFlattenToSet(
        oneToManyTableFilter(
          (_, k) => k !== '' && quadkeys.some(q => isQuadkeyRelated(q, k)),
          t
        )
      );

export const isQuadkeyRelated = (q: string, maybeRelated: string) =>
  q === maybeRelated ||
  isQuadkeyDescendant(q, maybeRelated) ||
  isQuadkeyAncestor(q, maybeRelated);

export const isQuadkeyDescendant = (q: string, maybeDescendant: string) =>
  maybeDescendant.startsWith(q) && q !== maybeDescendant;

export const isQuadkeyAncestor = (q: string, maybeAncestor: string) =>
  q.startsWith(maybeAncestor) && q !== maybeAncestor;

export const isQuadkeyParent = (q: string, maybeParent: string) =>
  maybeParent === q.slice(0, -1);

export const isQuadkeyChild = (q: string, maybeChild: string) =>
  q === maybeChild.slice(0, -1);

// excludes '' as an ancestor
export const ancestorProperFind = (t: QuadkeysTable, quadkey: string) =>
  tableFindKey((_, id) => isQuadkeyAncestor(quadkey, id) && id !== '', t);
