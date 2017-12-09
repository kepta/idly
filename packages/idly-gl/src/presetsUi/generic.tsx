import * as React from 'react';

export function ff({ field, tags }) {
  return (
    <div>
      <div>$ {field.label()}</div>
      <div>{tags[field.key]}</div>
    </div>
  );
}
