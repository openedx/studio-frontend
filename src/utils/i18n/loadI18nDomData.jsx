import enLocaleData from 'react-intl/locale-data/en';
import { addLocaleData } from 'react-intl';

const loadI18nDomData = () => {
  const retDict = {};
  let localeData;

  try {
    const domDefinedLocaleData = JSON.parse(document.getElementById('SFE_i18n_localeScript').innerHTML);
    localeData = domDefinedLocaleData.data;
    retDict.locale = domDefinedLocaleData.locale;
    retDict.messages = JSON.parse(document.getElementById('SFE_i18n_messages').innerHTML);
  } catch (err) {
    // fail back to default english values if any errors
    localeData = enLocaleData;
    retDict.locale = 'en';
    // an empty dict will yield defaultMessages on fallback, no problem there
    retDict.messages = {};
  }
  addLocaleData(localeData);

  return retDict;
};

export default loadI18nDomData;
