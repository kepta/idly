
import * as React from 'react';
export function FieldCombo({field, tags}) {
    return <div>
        <div>FieldCombo: {field.label()}</div>
        <div>{tags[field.key]}</div>
    </div>;
}
