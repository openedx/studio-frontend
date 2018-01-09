import { assetLoading } from '../constants/loadingTypes';
import { addLoadingField, removeLoadingField, toggleLockAsset } from './utils';

describe('Reducer Utils', () => {
  const assets = [
    { id: 'lynx', locked: false },
    { id: 'chinchilla', locked: true },
  ];
  const deepCopyAssets = () => (assets.map(asset => ({ ...asset })));

  describe('toggleLockAsset', () => {
    it('toggles asset lock', () => {
      const expectedAssets = deepCopyAssets();
      expectedAssets[0].locked = true;
      expect(toggleLockAsset(assets, 'lynx')).toEqual(expectedAssets);
    });
  });

  describe('addLoadingField', () => {
    it('add locking field', () => {
      const expectedAssets = deepCopyAssets();
      expectedAssets[1].loadingFields = [assetLoading.LOCK];
      expect(addLoadingField(assets, 'chinchilla', assetLoading.LOCK)).toEqual(expectedAssets);
    });
    it('adds loading field to existing loading fields', () => {
      const mockLoadingField = {
        MOCK: 'MOCK',
      };

      const newAssets = deepCopyAssets();
      newAssets[0].loadingFields = [assetLoading.LOCK];

      const expectedAssets = deepCopyAssets();
      expectedAssets[0].loadingFields = [assetLoading.LOCK, mockLoadingField];

      expect(addLoadingField(newAssets, 'lynx', mockLoadingField)).toEqual(expectedAssets);
    });
  });

  describe('removeLoadingField', () => {
    it('removes existing field', () => {
      const expectedAssets = deepCopyAssets();
      expectedAssets[0].loadingFields = [];
      const loadingAssets = addLoadingField(assets, 'lynx', assetLoading.LOCK);
      expect(removeLoadingField(loadingAssets, 'lynx', assetLoading.LOCK)).toEqual(expectedAssets);
    });
    it('no-op when field not present', () => {
      const expectedAssets = deepCopyAssets();
      expect(removeLoadingField(assets, 'lynx', assetLoading.LOCK)).toEqual(expectedAssets);
    });
  });
});
