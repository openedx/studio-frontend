import esLocaleData from 'react-intl/locale-data/en';
import { addLocaleData } from 'react-intl';

import messages from '../json/es_419.json'

export default class SFELanguage {
  render() {
    addLocaleData(esLocaleData);
    return (
      <script type="application/json" id="SFE_i18n_messages">
        { messages }
      </script>
    );
  }
}
