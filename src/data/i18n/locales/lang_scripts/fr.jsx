import frLocaleData from 'react-intl/locale-data/en';
import { addLocaleData } from 'react-intl';

import messages from '../json/fr.json'

export default class SFELanguage {
  render() {
    addLocaleData(frLocaleData);
    return (
      <script type="application/json" id="SFE_i18n_messages">
        { messages }
      </script>
    );
  }
}
