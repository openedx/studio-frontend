import loadI18nDomData from './loadI18nDomData';

/* eslint-disable quote-props */
// quot-props is incompatible with "valid JSON"
const testJSON = { 'testMessage': 'Hola' };
/* eslint-enable quote-props */

describe('loadI18nDomData Utility Functions', () => {
  describe('loadI18nDomData', () => {
    it('loads good data', () => {
      const ret = loadI18nDomData();
      expect(ret.locale).toEqual('fr');
      expect(ret.messages).toEqual(testJSON);
    });
    it('falls back to english when given bad data', () => {
      document.getElementById('SFE_i18n_data').innerHTML = 'not real json }}::}{}:{';
      const ret = loadI18nDomData();
      expect(ret.locale).toEqual('en');
      expect(ret.messages).toEqual({});
    });
  });
});
