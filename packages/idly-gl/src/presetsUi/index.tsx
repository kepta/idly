import * as React from 'react';
import { render } from 'react-dom';
import { Leaf } from 'idly-common/lib/state/graph/Leaf';
import { presetMatch, all } from 'idly-common/lib/geojson/presetMatch';
import { en } from './en.json';

import IDPresetsUI from './id-presets-ui';

export function renderPresets(
  dom: any,
  { feature, leaf }: { feature: any; leaf: Leaf }
) {
  const geometry = feature.properties['osm_basic--geometry'];
  const preset = presetMatch(leaf.getEntity().tags, geometry);
  // ref: https://github.com/openstreetmap/iD/blob/master/modules/ui/preset_editor.js#L50
  /**
   * there are two types of fields iD is displaying
   * 1. preset.fields.filter
   * 2. all.universal() with some filter logic
   *
   * universal fields aren't that straightforward. They are hidden by default
   * and https://github.com/openstreetmap/iD/blob/master/modules/ui/field.js#L198
   * decides whether to show or not. If it is not shown, it sits in the `Add Field`
   * for the user to add them. If the user clicks them the https://github.com/openstreetmap/iD/blob/master/modules/ui/field.js#L188
   * variable is put to true and they are shown.
   */
  let fields = preset.fields.filter(field => field.matchGeometry(geometry));

  const showUniversal = false;

  let universalFields = all
    .universal()
    .filter(field => preset.fields.indexOf(field) === -1)
    .filter(
      // ref: https://github.com/openstreetmap/iD/blob/master/modules/ui/field.js#L198
      // for a better show/ hide implementation. For now it is readonly state.
      field =>
        showUniversal ||
        (field.keys || [field.key]).some(key => !!leaf.getEntity().tags[key])
    );

  // @NOTE: iD converts key to keys https://github.com/openstreetmap/iD/blob/master/modules/ui/field.js#L44

  return render(
    <div>
      <PresetsUi fields={fields} feature={feature} leaf={leaf} />,
      <PresetsUi fields={universalFields} feature={feature} leaf={leaf} />
    </div>,
    dom
  );
}
export const tOpts = { dynamicTranslation: en };

export function PresetsUi({
  fields,
  feature,
  leaf
}: {
  fields: any;
  feature: any;
  leaf: Leaf;
}) {
  console.log(fields);
  return (
    <div
      style={{
        backgroundColor: 'yellow',
        width: '20vw'
      }}
    >
      {fields.map((field, i) => {
        const Comp = IDPresetsUI[field.type];
        return (
          <PresetSingle field={field} key={i} index={i}>
            <Comp field={field} tags={leaf.getEntity().tags} />
          </PresetSingle>
        );
      })}
    </div>
  );
}

function PresetSingle({ field, children, index }) {
  return (
    <div>
      <span className="preset-label" style={{ fontWeight: 700 }}>
        {index + 1} :{field.label(tOpts)}
      </span>
      <span>{children}</span>
    </div>
  );
}
