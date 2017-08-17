import { EntityId } from 'structs';
import { EntityType, Geometry } from 'structs/geometry';
import { Member } from 'structs/members';
import { Properties, propertiesGen } from 'structs/properties';
import { Tags } from 'structs/tags';

export interface Relation {
  readonly id: EntityId;
  readonly type: EntityType.RELATION;
  readonly tags: Tags;
  readonly properties: Properties;
  readonly members: Member[];
}

export function relationFactory({
  id,
  tags = new Map(),
  properties = propertiesGen({}),
  members = []
}: {
  id: EntityId;
  tags?: Tags;
  properties?: Properties;
  members?: Member[];
}): Relation {
  return {
    id,
    type: EntityType.RELATION,
    tags,
    properties,
    members
  };
}
