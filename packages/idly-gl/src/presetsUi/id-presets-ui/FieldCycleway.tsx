
import * as React from 'react';
export function FieldCycleway({field, tags}) {
    return <div>
        <div>FieldCycleway: {field.label()}</div>
        <div>{tags[field.key]}</div>
    </div>;
}
