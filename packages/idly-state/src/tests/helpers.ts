import * as fs from 'fs';
import { Entity } from 'idly-common/lib/osm/structures';
import { parser } from 'idly-faster-osm-parser';
import * as path from 'path';

export const parseFixture: (name: string) => Entity[] = (
  name: string
): Entity[] =>
  parser(fs.readFileSync(path.join(__dirname, './fixtures', name), 'utf-8'));
