
import * as React from 'react';
export function FieldRestrictions({field, tags}) {
    return <div>
        <div>FieldRestrictions: {field.label()}</div>
        <div>{tags[field.key]}</div>
    </div>;
}
