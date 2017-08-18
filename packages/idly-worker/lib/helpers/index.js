export function isClosed(entity) {
    return (entity.nodes.length > 1 &&
        entity.nodes[0] === entity.nodes[entity.nodes.length - 1]);
}
//# sourceMappingURL=index.js.map