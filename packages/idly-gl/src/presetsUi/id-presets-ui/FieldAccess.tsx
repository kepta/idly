import * as React from 'react';
export function FieldAccess({ field, tags }) {
  return (
    <div>
      <div>FieldAccess: {field.label()}</div>
      <div>{tags[field.key]}</div>
    </div>
  );
}
