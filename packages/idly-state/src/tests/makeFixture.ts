import { replacer } from 'idly-common/lib/misc/parsing';
import { stateAddVirgins, stateCreate, stateGetVisibles } from '../index';
import { parseFixture } from './helpers';

const foo = (str: string) => {
  const virginEntities = parseFixture(str);
  const osmState = stateCreate();
  stateAddVirgins(osmState, virginEntities, '1');
  require('fs').writeFileSync(
    str + '.json',
    JSON.stringify(stateGetVisibles(osmState, ['1']), replacer),
    'utf-8'
  );
};

foo('three.xml');
foo('one.xml');
foo('two.xml');
foo('four.xml');
