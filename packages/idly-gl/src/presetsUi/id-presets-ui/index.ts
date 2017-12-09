import { FieldAccess } from './FieldAccess';
import { FieldAddress } from './FieldAddress';
import { FieldCycleway } from './FieldCycleway';
import { FieldLanes } from './FieldLanes';
import { FieldLocalized } from './FieldLocalized';
import { FieldMaxspeed } from './FieldMaxspeed';
import { FieldRestrictions } from './FieldRestrictions';
import { FieldTextarea } from './FieldTextarea';
import { FieldWikipedia } from './FieldWikipedia';
import {
  FieldCheck,
  FieldCheck as FieldDefaultCheck,
  FieldCheck as FieldOnewayCheck
} from './FieldCheck';
import {
  FieldCombo,
  FieldCombo as FieldMultiCombo,
  FieldCombo as FieldNetworkCombo,
  FieldCombo as FieldSemiCombo,
  FieldCombo as FieldTypeCombo
} from './FieldCombo';
import {
  FieldText,
  FieldText as FieldEmail,
  FieldText as FieldNumber,
  FieldText as FieldTel,
  FieldText as FieldUrl
} from './FieldText';

import { FieldRadio, FieldRadio as FieldStructureRadio } from './FieldRadio';

export default {
  access: FieldAccess,
  address: FieldAddress,
  check: FieldCheck,
  combo: FieldCombo,
  cycleway: FieldCycleway,
  defaultCheck: FieldDefaultCheck,
  email: FieldEmail,
  lanes: FieldLanes,
  localized: FieldLocalized,
  maxspeed: FieldMaxspeed,
  multiCombo: FieldMultiCombo,
  networkCombo: FieldNetworkCombo,
  number: FieldNumber,
  onewayCheck: FieldOnewayCheck,
  radio: FieldRadio,
  restrictions: FieldRestrictions,
  semiCombo: FieldSemiCombo,
  structureRadio: FieldStructureRadio,
  tel: FieldTel,
  text: FieldText,
  textarea: FieldTextarea,
  typeCombo: FieldTypeCombo,
  url: FieldUrl,
  wikipedia: FieldWikipedia
};
