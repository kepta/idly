import { Entity } from 'idly-common/lib/osm/structures';
import { Log } from './dataStructures/log';
import { ReadonlyTable } from './dataStructures/table';
import { DerivedTable } from './state/derivedTable/index';
import { VirginState } from './state/virgin/index';

export interface OsmState {
  readonly virgin: VirginState<Entity>;
  readonly modified: ReadonlyTable<Entity>;
  readonly derivedTable: DerivedTable;
  readonly log: Log;
}
