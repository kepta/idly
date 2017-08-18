// export const table: Table = new Map();
export function addEntitiesTable(t, entities) {
    for (const e of entities) {
        if (t.has(e.id))
            continue;
        t.set(e.id, e);
    }
    return t;
}
//# sourceMappingURL=table.js.map