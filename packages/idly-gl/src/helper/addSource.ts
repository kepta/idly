export function addSource(layer: any, source: string) {
  return {
    source,
    id: source + '-' + layer.id,
    ...layer
  };
}
