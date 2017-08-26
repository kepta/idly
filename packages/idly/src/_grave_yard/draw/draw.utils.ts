/**
 * @REVISIT might want to type DrawFeature
 *  exactly, this thing comes from mapboxgl
 *  query rendered features.
 */
export const sanitizeDrawFeatures = (DrawFeature: any) => ({
  type: DrawFeature.feature,
  properties: DrawFeature.properties,
  id: DrawFeature.id,
  geometry: DrawFeature.geometry
});
