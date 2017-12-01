export function addSource(layer: any, source: string) {
  return {
    ...layer,
    source,
    id: source + '-' + layer.id
  };
}
