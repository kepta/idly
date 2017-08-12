const win: any = window;
export function attachToWindow(name, obj: any) {
  win[name] = obj;
}

export function getFromWindow(name) {
  return win[name];
}

export function getFromUrlSearch(x) {
  return window.location.search.indexOf(x) > -1;
}

attachToWindow('findInMap', (id, source = 'virgin') =>
  getFromWindow('map')
    .getSource(source)
    .serialize()
    .data.features.filter(f => f.properties.id === id)
);
