import * as React from 'react';
import { Tags } from 'idly-common/lib/osm/structures';

export function FieldTextarea({ field, tags }: { field: any; tags: Tags }) {
  return (
    <div>
      <div>FieldTextarea: {field.label()}</div>
      <div>{tags[field.key]}</div>
    </div>
  );
}
