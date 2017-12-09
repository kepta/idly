
import * as React from 'react';
export function FieldEmail({field, tags}) {
    return <div>
        <div>FieldEmail: {field.label()}</div>
        <div>{tags[field.key]}</div>
    </div>;
}
