import { Either } from 'monet';
import * as R from 'ramda';
import { Entity, EntityType, Relation, Way } from '../osm/structures';
import { Err, ErrorWhen, foldEitherArray, isVirgin } from './helper';
import { getId, getLatestVersion, getVersion, Log } from './log/index';
import { State } from './osmTables/state';
import { EntityTable } from './table';

export const checkValidNode = (obj: any): boolean =>
  !!(
    obj &&
    checkId(obj, 'node') &&
    checkTypeNode(obj) &&
    checkLonLat(obj) &&
    checkTags(obj) &&
    checkAttributes(obj)
  );

export const checkValidWay = (obj: any): boolean =>
  !!(
    obj &&
    checkId(obj, 'way') &&
    checkTypeWay(obj) &&
    checkTags(obj) &&
    checkAttributes(obj) &&
    checkNd(obj)
  );

export const checkValidRelation = (obj: any): boolean =>
  !!(
    obj &&
    checkId(obj, 'relation') &&
    checkTypeRelation(obj) &&
    checkTags(obj) &&
    checkAttributes(obj) &&
    checkMembers(obj)
  );

export const checkId = (obj: any, type: string) =>
  typeof obj.id === 'string' && obj.id.charAt(0) === type.charAt(0);

export const checkTypeNode = (obj: any) => checkType(obj, EntityType.NODE);

export const checkTypeWay = (obj: any) => checkType(obj, EntityType.WAY);

export const checkTypeRelation = (obj: any) =>
  checkType(obj, EntityType.RELATION);

export const checkType = (obj: any, type: string) =>
  obj.type && obj.type === type;

export const checkLonLat = (obj: any) =>
  obj.loc && typeof obj.loc.lat === 'number' && typeof obj.loc.lon === 'number';

export const checkTags = (obj: any) =>
  obj.tags &&
  Object.keys(obj.tags)
    .map(k => obj.tags[k])
    .every(v => typeof v === 'string');

export const checkAttributes = (obj: any) =>
  obj.attributes &&
  Object.keys(obj.attributes)
    .map(k => (obj.attributes as any)[k])
    .every(v => typeof v === 'string' || typeof v === 'boolean');

export const checkEntityShape = (obj: Entity): boolean => {
  if (obj.type === EntityType.NODE) {
    return checkValidNode(obj);
  }
  if (obj.type === EntityType.WAY) {
    return checkValidWay(obj);
  }
  if (obj.type === EntityType.RELATION) {
    return checkValidRelation(obj);
  }
  return false;
};
export const checkNd = (obj: Way) =>
  Array.isArray(obj.nodes) &&
  obj.nodes.every(n => typeof n === 'string' && n.charAt(0) === 'n');

export const checkMembers = (obj: Relation) =>
  Array.isArray(obj.members) && obj.members.every(m => m.hasOwnProperty('id'));

export const getParent: (
  indexOrId: string,
  eTable: EntityTable
) => Entity | undefined = (indexOrId, eTable) => {
  if (isVirgin(indexOrId)) {
    return undefined;
  }
  const version = getVersion(indexOrId);
  if (version === 0) {
    return eTable.get(getId(indexOrId));
  }
  return eTable.get(`${getId(indexOrId)}#${version - 1}`);
};

export const checkEntityVersion = R.curry(
  (log: Log, e: Entity) => getLatestVersion(e.id)(log) + 1 === getVersion(e.id)
);

export const defaultChecks = (
  state: State,
  entities: Entity[]
): Either<Error, Entity[]> => {
  const check = (en: Entity) =>
    Err.right(en)
      .flatMap(
        ErrorWhen(
          e => !checkEntityShape(e),
          new Error(en.id + ' Shape is incorrect')
        )
      )
      .flatMap(
        ErrorWhen(
          e => isVirgin(e.id),
          new Error(en.id + ' is unmodified(virgin)')
        )
      )
      .flatMap(
        ErrorWhen(
          e => !getParent(e.id, state.entityTable),
          new Error(en.id + ' doesnt have a parent')
        )
      )
      .flatMap(
        ErrorWhen(
          e => !checkEntityVersion(state.log)(e),
          new Error(en.id + ' version should be +1 of what is in the state')
        )
      );

  return Err.right(entities.map(e => check(e))).flatMap(es =>
    foldEitherArray(es)
  );
};
