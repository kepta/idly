// ref: https://github.com/openstreetmap/iD/blob/master/modules/ui/fields/access.js
import * as React from 'react';
import { en } from '../../../translations/en';
import { Tags } from 'idly-common/lib/osm/structures';

const placeholders: any = {
  footway: {
    foot: 'designated',
    motor_vehicle: 'no'
  },
  steps: {
    foot: 'yes',
    motor_vehicle: 'no',
    bicycle: 'no',
    horse: 'no'
  },
  pedestrian: {
    foot: 'yes',
    motor_vehicle: 'no'
  },
  cycleway: {
    motor_vehicle: 'no',
    bicycle: 'designated'
  },
  bridleway: {
    motor_vehicle: 'no',
    horse: 'designated'
  },
  path: {
    foot: 'yes',
    motor_vehicle: 'no',
    bicycle: 'yes',
    horse: 'yes'
  },
  motorway: {
    foot: 'no',
    motor_vehicle: 'yes',
    bicycle: 'no',
    horse: 'no'
  },
  trunk: {
    motor_vehicle: 'yes'
  },
  primary: {
    foot: 'yes',
    motor_vehicle: 'yes',
    bicycle: 'yes',
    horse: 'yes'
  },
  secondary: {
    foot: 'yes',
    motor_vehicle: 'yes',
    bicycle: 'yes',
    horse: 'yes'
  },
  tertiary: {
    foot: 'yes',
    motor_vehicle: 'yes',
    bicycle: 'yes',
    horse: 'yes'
  },
  residential: {
    foot: 'yes',
    motor_vehicle: 'yes',
    bicycle: 'yes',
    horse: 'yes'
  },
  unclassified: {
    foot: 'yes',
    motor_vehicle: 'yes',
    bicycle: 'yes',
    horse: 'yes'
  },
  service: {
    foot: 'yes',
    motor_vehicle: 'yes',
    bicycle: 'yes',
    horse: 'yes'
  },
  motorway_link: {
    foot: 'no',
    motor_vehicle: 'yes',
    bicycle: 'no',
    horse: 'no'
  },
  trunk_link: {
    motor_vehicle: 'yes'
  },
  primary_link: {
    foot: 'yes',
    motor_vehicle: 'yes',
    bicycle: 'yes',
    horse: 'yes'
  },
  secondary_link: {
    foot: 'yes',
    motor_vehicle: 'yes',
    bicycle: 'yes',
    horse: 'yes'
  },
  tertiary_link: {
    foot: 'yes',
    motor_vehicle: 'yes',
    bicycle: 'yes',
    horse: 'yes'
  }
};

export function FieldAccess({ field, tags }: { field: any; tags: Tags }) {
  // const fieldType: string = field.type;
  // const fieldId: string = field.id;
  // const fieldPlaceholder: string = field.placeholder() || 'Unknown';
  const fieldKeys: string[] = field.keys;

  const opts = fieldKeys.map(d => field.t('types.' + d, en));
  // const value: string = tags[fieldKey] || '';
  const _placeholders = placeholders[tags['highway']];

  return (
    <span>
      {fieldKeys.map((key, i) => {
        let placeholder = tags.access || _placeholders[key] || 'Not Specified';

        if (key === 'access') {
          placeholder = 'yes';
        }

        return (
          <span key={i}>
            <span>{opts[i]}</span>
            <input placeholder={placeholder} value={tags[key]} />
          </span>
        );
      })}
    </span>
  );
}
