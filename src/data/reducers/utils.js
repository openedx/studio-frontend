export const toggleLockAsset = (assets, assetId) => assets.map(asset => (
  asset.id === assetId ? { ...asset, locked: !asset.locked } : asset));

export const removeLoadingField = (assets, assetId, loadingField) => assets.map((asset) => {
  if (asset.id === assetId) {
    const loadingFields = asset.loadingFields ?
      asset.loadingFields.filter(field => field !== loadingField) : asset.loadingFields;
    return {
      ...asset,
      loadingFields,
    };
  }
  return asset;
});

export const addLoadingField = (assets, assetId, loadingField) => assets.map((asset) => {
  if (asset.id === assetId) {
    const loadingFields = asset.loadingFields ?
      [...asset.loadingFields, loadingField] : [loadingField];
    return { ...asset, loadingFields };
  }
  return asset;
});
