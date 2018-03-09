import enLocaleData from 'react-intl/locale-data/en';
import { addLocaleData } from 'react-intl';

import localeDataMap from '../../data/i18n/locales/currentlySupportedLangs';

const loadI18nDomData = () => {
  try {
    const domDefinedData = JSON.parse(document.getElementById('SFE_i18n_data').innerHTML);
    const localeData = localeDataMap[domDefinedData.locale];
    addLocaleData(localeData);
    return domDefinedData;
  } catch (err) {
    // fail back to default english values if any errors
    addLocaleData(enLocaleData);
    return {
      locale: 'en',
      messages: {},
    };
  }
};

export default loadI18nDomData;
