import * as React from 'react';

import { Entities } from 'osm/entities/entities';

interface IPropsType {
  name: string;
  sourceName: string;
  dirtyMapAccess;
  entities: Entities;
  updateSource: (
    data: Entities,
    dirtyMapAccess: (map: any) => void,
    sourceId: string
  ) => void;
}

export class Layer extends React.PureComponent<IPropsType, {}> {}
