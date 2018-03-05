import { Tags } from 'idly-common/lib/osm/structures';
import * as React from 'react';

export function FieldAddress({ field, tags }: { field: any; tags: Tags }) {
  return (
    <div>
      <div>FieldAddress: {field.label()}</div>
      <div>{tags[field.key]}</div>
    </div>
  );
}
