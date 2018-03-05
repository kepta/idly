// ref: https://github.com/openstreetmap/iD/blob/master/modules/ui/fields/input.js

import { Tags } from 'idly-common/lib/osm/structures';
import * as React from 'react';
export function FieldText({ field, tags }: { field: any; tags: Tags }) {
  const fieldType: string = field.type;
  const fieldPlaceholder: string = field.placeholder() || 'Unknown';
  const fieldKey: string = field.key;
  const value: string = tags[fieldKey] || '';
  // if (fieldType === 'number') {
  // } else if (fieldType === 'tel') {
  // }
  return (
    <input
      type={fieldType}
      id="preset-input-name"
      className="localized-main combobox-input"
      placeholder={fieldPlaceholder}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      value={value}
    />
  );
}
