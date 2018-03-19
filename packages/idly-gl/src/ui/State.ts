import { Entity } from 'idly-common/lib/osm/structures';

export const enum MainTabs {
  Tags = 'Tags',
  Presets = 'Presets',
  Relations = 'Relations',
}

export interface State {
  mainTab: {
    active: MainTabs;
  };
  tags: {};
  selectEntity: {
    hoverId?: string;
    selectedId?: string;
    beforeLayer?: string;
  };
  map: {
    layers: any[]; // the gl layers
    quadkeysData: Array<{
      quadkey: string; // the current active quadkeys
      entities: Entity[]; // virgin entities corresponding to the quadkey
    }>;
  };
  domContainer: Element;
  gl: any;
}
