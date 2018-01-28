import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { all } from 'idly-common/lib/geojson/presetMatch';
import { FieldAccess } from './FieldAccess';

describe('Field Access', () => {
  it('should mount', () => {
    const tags = { highway: 'residential' };
    const field = all.field('access');
    expect(
      renderer.create(<FieldAccess field={field} tags={tags} />)
    ).toMatchSnapshot();
  });
});
