import * as React from 'react';
export function FieldText({ field, tags }) {
  return (
    <div>
      <div>FieldText: {field.label()}</div>
      <div>{tags[field.key]}</div>
    </div>
  );
}
