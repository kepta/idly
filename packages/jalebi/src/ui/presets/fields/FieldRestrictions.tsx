import { Tags } from 'idly-common/lib/osm/structures';
import * as React from 'react';

export function FieldRestrictions({ field, tags }: { field: any; tags: Tags }) {
  return (
    <div>
      <div>FieldRestrictions: {field.label()}</div>
      <div>{tags[field.key]}</div>
    </div>
  );
}
