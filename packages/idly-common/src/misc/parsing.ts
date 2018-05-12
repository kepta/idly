export function replacer(_: string, value: any) {
  // Filtering out properties
  if (value instanceof Map) {
    return { '@@idly@type': 'Map', value: Array.from(value) };
  }
  if (value instanceof Set) {
    return { '@@idly@type': 'Set', value: Array.from(value) };
  }

  return value;
}

export function reviver(_: string, value: any) {
  if (
    value !== null &&
    typeof value === 'object' &&
    value['@@idly@type'] === 'Map'
  ) {
    return new Map(value.value);
  }

  if (
    value !== null &&
    typeof value === 'object' &&
    value['@@idly@type'] === 'Set'
  ) {
    return new Set(value.value);
  }
  return value;
}
