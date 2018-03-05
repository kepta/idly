n = deepClone(state.getElement('w226829109'));
l = self.log.logCreate();
n2 = {
  ...n,
  tags: {
    ...n.tags,
    highway: 'path',
  },
  id: self.log.logGenerateNextModifiedId(n.id)(l),
};

self.l = log.logAddEntry(new Set([n2.id]))(l);

osm.osmStateAddModifieds(state, l, [n2]);

n42824136;

self.l = log.logAddEntry(new Set([n2.id]))(l);
osm.osmStateAddModifieds(state, l, [n2]);

function addToLog(...entities) {
  let set = new Set(entities.map(r => r.id));
  self.l = log.logAddEntry(set)(self.l);
}

function modify(id, foo) {
  const entity = state.elements.get(id);
  return {
    ...entity,
    id: self.log.logGenerateNextModifiedId(entity.id)(self.l),
    ...foo(entity),
  };
}

const deepClone = r => JSON.parse(JSON.stringify(r));
