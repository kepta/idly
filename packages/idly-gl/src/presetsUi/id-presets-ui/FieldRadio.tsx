
import * as React from 'react';
export function FieldRadio({field, tags}) {
    return <div>
        <div>FieldRadio: {field.label()}</div>
        <div>{tags[field.key]}</div>
    </div>;
}
