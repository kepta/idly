
import * as React from 'react';
export function FieldTextarea({field, tags}) {
    return <div>
        <div>FieldTextarea: {field.label()}</div>
        <div>{tags[field.key]}</div>
    </div>;
}
