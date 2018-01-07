import * as React from 'react';
import { Tags } from 'idly-common/lib/osm/structures';

export function FieldMaxspeed({ field, tags }: { field: any; tags: Tags }) {
  return (
    <div>
      <div>FieldMaxspeed: {field.label()}</div>
      <div>{tags[field.key]}</div>
    </div>
  );
}
