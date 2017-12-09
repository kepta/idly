
import * as React from 'react';
export function FieldAddress({field, tags}) {
    return <div>
        <div>FieldAddress: {field.label()}</div>
        <div>{tags[field.key]}</div>
    </div>;
}
