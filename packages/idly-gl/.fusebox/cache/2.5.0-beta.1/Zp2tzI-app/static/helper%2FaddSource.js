module.exports = { contents: "\"use strict\";\nObject.defineProperty(exports, \"__esModule\", { value: true });\nfunction addSource(layer, source) {\n    return Object.assign({}, layer, { source, id: source + '-' + layer.id });\n}\nexports.addSource = addSource;\n//# sourceMappingURL=addSource.js.map",
dependencies: [],
sourceMap: "{\"version\":3,\"file\":\"helper/addSource.js\",\"sourceRoot\":\"\",\"sources\":[\"/src/helper/addSource.ts\"],\"names\":[],\"mappings\":\";;AAAA,mBAA0B,KAAU,EAAE,MAAc;IAClD,MAAM,mBACD,KAAK,IACR,MAAM,EACN,EAAE,EAAE,MAAM,GAAG,GAAG,GAAG,KAAK,CAAC,EAAE,IAC3B;AACJ,CAAC;AAND,8BAMC\",\"sourcesContent\":[\"export function addSource(layer: any, source: string) {\\n  return {\\n    ...layer,\\n    source,\\n    id: source + '-' + layer.id\\n  };\\n}\\n\"]}",
headerContent: undefined,
mtime: 1512113577000,
devLibsRequired : undefined,
_ : {}
}
