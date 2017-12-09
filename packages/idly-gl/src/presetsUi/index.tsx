import * as React from 'react';
import { render } from 'react-dom';
import { Feature } from 'geojson';
import { Leaf } from 'idly-common/lib/state/graph/Leaf';
import { presetMatch } from 'idly-common/lib/geojson/presetMatch';
import IDPresetsUI from './id-presets-ui';

export function renderPresets(
  dom: any,
  { feature, leaf }: { feature: any; leaf: Leaf }
) {
  const geometry = feature.properties['osm_basic--geometry'];
  const preset = presetMatch(leaf.getEntity().tags, geometry);
  const fields = preset.fields.filter(field => field.matchGeometry(geometry));
  return render(
    <PresetsUi fields={fields} feature={feature} leaf={leaf} />,
    dom
  );
}

export function PresetsUi({
  fields,
  feature,
  leaf
}: {
  fields: any;
  feature: any;
  leaf: Leaf;
}) {
  return (
    <div
      style={{
        backgroundColor: 'yellow',
        width: '20vw'
      }}
    >
      {fields.map((field, i) => {
        const Comp = IDPresetsUI[field.type];
        return <Comp key={i} field={field} tags={leaf.getEntity().tags} />;
      })}
    </div>
  );
}
