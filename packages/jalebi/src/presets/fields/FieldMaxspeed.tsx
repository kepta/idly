import { Tags } from 'idly-common/lib/osm/structures';
import * as React from 'react';

export function FieldMaxspeed({ field, tags }: { field: any; tags: Tags }) {
  return (
    <div>
      <div>FieldMaxspeed: {field.label()}</div>
      <div>{tags[field.key]}</div>
    </div>
  );
}
