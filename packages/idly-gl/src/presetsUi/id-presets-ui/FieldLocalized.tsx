
import * as React from 'react';
export function FieldLocalized({field, tags}) {
    return <div>
        <div>FieldLocalized: {field.label()}</div>
        <div>{tags[field.key]}</div>
    </div>;
}
