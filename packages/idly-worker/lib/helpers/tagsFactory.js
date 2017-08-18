export function tagsFactory(obj) {
    const tags = new Map();
    Object.keys(obj).forEach(k => tags.set(k, obj[k]));
    return tags;
}
//# sourceMappingURL=tagsFactory.js.map