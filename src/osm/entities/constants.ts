interface IGeometries {
  readonly POINT: 'point';
  readonly VERTEX: 'vertex';
  readonly AREA: 'area';
  readonly LINE: 'line';
  readonly RELATION: 'relation';
}

export const Geometries: IGeometries = {
  POINT: 'point',
  VERTEX: 'vertex',
  AREA: 'area',
  LINE: 'line',
  RELATION: 'relation'
};

export type Geometry = IGeometries[keyof IGeometries];
