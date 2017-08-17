export enum Geometry {
  POINT = 'point',
  VERTEX = 'vertex',
  VERTEX_SHARED = 'vertex_shared', // the one shared among multiple ways
  AREA = 'area',
  LINE = 'line',
  RELATION = 'relation'
}

export enum EntityType {
  NODE = 'node',
  WAY = 'way',
  RELATION = 'relation'
}
