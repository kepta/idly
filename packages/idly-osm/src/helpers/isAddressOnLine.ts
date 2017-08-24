import { Entity } from 'idly-common/lib';
// @TOFIX
export function isOnAddressLine(entity?: Entity) {
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
