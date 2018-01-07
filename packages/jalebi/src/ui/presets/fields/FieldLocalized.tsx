import * as React from 'react';
import { Tags } from 'idly-common/lib/osm/structures';

export function FieldLocalized({ field, tags }: { field: any; tags: Tags }) {
  return (
    <div>
      <div>FieldLocalized: {field.label()}</div>
      <div>{tags[field.key]}</div>
    </div>
  );
}
