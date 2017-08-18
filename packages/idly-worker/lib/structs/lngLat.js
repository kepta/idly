export function genLngLat(obj) {
    if (Array.isArray(obj)) {
        return { lon: obj[0], lat: obj[1] };
    }
    return Object.assign({}, obj);
}
//# sourceMappingURL=lngLat.js.map