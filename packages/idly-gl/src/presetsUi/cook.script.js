var fs = require('fs');
var x = [
  'FieldAccess',
  'FieldAddress',
  'FieldCycleway',
  'FieldLanes',
  'FieldLocalized',
  'FieldMaxspeed',
  'FieldRestrictions',
  'FieldTextarea',
  'FieldWikipedia',
  'FieldCheck',
  'FieldCombo',
  'FieldText',
  'FieldRadio'
];
var react = i => `
import * as React from 'react';
export function ${i}({field, tags}) {
    return <div>
        <div>${i}: {field.label()}</div>
        <div>{tags[field.key]}</div>
    </div>;
}
`;

x.forEach(i =>
  fs.writeFileSync('./src/presetsUi/id-presets-ui/' + i + '.tsx', react(i))
);
