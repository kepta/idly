
import * as React from 'react';
export function FieldMaxspeed({field, tags}) {
    return <div>
        <div>FieldMaxspeed: {field.label()}</div>
        <div>{tags[field.key]}</div>
    </div>;
}
