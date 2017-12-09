
import * as React from 'react';
export function FieldWikipedia({field, tags}) {
    return <div>
        <div>FieldWikipedia: {field.label()}</div>
        <div>{tags[field.key]}</div>
    </div>;
}
