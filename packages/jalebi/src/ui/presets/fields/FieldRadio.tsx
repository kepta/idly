import * as React from 'react';
import { Tags } from 'idly-common/lib/osm/structures';

export function FieldRadio({ field, tags }: { field: any; tags: Tags }) {
  return (
    <div>
      <div>FieldRadio: {field.label()}</div>
      <div>{tags[field.key]}</div>
    </div>
  );
}
