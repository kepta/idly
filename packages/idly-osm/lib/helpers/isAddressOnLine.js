"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @TOFIX
function isOnAddressLine(entity) {
    return false;
    //   return resolver.transient(this, 'isOnAddressLine', function() {
    //     return (
    //       resolver.parentWays(this).filter(function(parent) {
    //         return (
    //           parent.tags.hasOwnProperty('addr:interpolation') &&
    //           parent.geometry(resolver) === 'line'
    //         );
    //       }).length > 0
    //     );
    //   });
}
exports.isOnAddressLine = isOnAddressLine;
//# sourceMappingURL=isAddressOnLine.js.map