
import * as React from 'react';
export function FieldCheck({field, tags}) {
    return <div>
        <div>FieldCheck: {field.label()}</div>
        <div>{tags[field.key]}</div>
    </div>;
}
