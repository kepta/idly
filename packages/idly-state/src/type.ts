import { Entity } from 'idly-common/lib/osm/structures';
import { Log } from './log';
import { DerivedTable } from './osmState/derivedTable';
import { VirginState } from './state/state';
import { ReadonlyTable } from './table';

export interface OsmState {
  readonly virgin: VirginState<Entity>;
  readonly changedTable: ReadonlyTable<Entity>;
  readonly derivedTable: DerivedTable;
  readonly log: Log;
}
