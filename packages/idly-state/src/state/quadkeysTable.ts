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
import { ReadonlyOneToManyTable } from '../table/oneToMany';
import { tableAdd, tableValues } from '../table/regular';

export type QuadkeysTable = OneToManyTable<string>;
export type ReadonlyQuadkeysTable = ReadonlyOneToManyTable<string>;

/**
 * All the modifiedIds are stored in the
 * global root '' quadkey, the virgin Ids are always
 * stored in whatever quadkey they came from. The
 * advantage being modifiedIds being available for render
 * at all times.
 */

export function quadkeysTableAdd(
  t: QuadkeysTable,
  ids: string[],
  quadkey: string
) {
  if (ancestorProperFind(t, quadkey)) {
    return;
  }

  // Note: since '' quadkey is not a valid quadkey,
  // but it is a subset of every string. It becomes
  // a good place to search for everything.
  // we let it be used as key store and only append
  // to it.
  if (quadkey === '') {
    oneToManyTableUpdateIndex(t, quadkey, ids);
    return;
  }

  // TOFIX we wanna remove this
  // removes any descendant in favour of the parent quadkey
  removeAllDescendants(t, quadkey);

  tableAdd(setCreate(ids), quadkey, t);
}

export function removeAllDescendants(t: QuadkeysTable, quadkey: string) {
  tableForEach((_, id) => {
    if (isQuadkeyDescendant(quadkey, id)) {
      tableRemove(id, t);
    }
  }, t);
}

export const quadkeysTableCreate = (
  q = oneToManyTableCreate<string>()
): QuadkeysTable => q;

export const quadkeysTableCreateFrom = (t: QuadkeysTable, quadkeys: [string]) =>
  mapFilter((_, k) => quadkeys.indexOf(k) > -1, t);

export const quadkeysTableFlatten = (t: QuadkeysTable) =>
  iterableFlattenToSet<string>(tableValues(t));

export const quadkeysTableFindRelated = (
  t: QuadkeysTable,
  quadkeys: string[]
): ReadonlySet<string> =>
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
