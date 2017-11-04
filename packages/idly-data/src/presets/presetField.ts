import { clone as _clone, keys as _keys, omit as _omit } from 'lodash';
import { t as stubT } from './t';

export function presetField(id, field, t = stubT) {
  field = _clone(field);

  field.id = id;

  field.matchGeometry = function(geometry) {
    return !field.geometry || field.geometry === geometry;
  };

  field.t = function(scope, options) {
    return t('presets.fields.' + id + '.' + scope, options);
  };

  field.label = function() {
    return field.t('label', { default: id });
  };

  var placeholder = field.placeholder;
  field.placeholder = function() {
    return field.t('placeholder', { default: placeholder });
  };

  return field;
}
