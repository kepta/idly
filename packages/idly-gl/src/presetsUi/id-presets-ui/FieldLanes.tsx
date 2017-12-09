
import * as React from 'react';
export function FieldLanes({field, tags}) {
    return <div>
        <div>FieldLanes: {field.label()}</div>
        <div>{tags[field.key]}</div>
    </div>;
}
