import arLocaleData from 'react-intl/locale-data/en';
import { addLocaleData } from 'react-intl';

import messages from '../json/ar.json'

export default class SFELanguage {
  render() {
    addLocaleData(arLocaleData);
    return (
      <script type="application/json" id="SFE_i18n_messages">
        { messages }
      </script>
    );
  }
}
