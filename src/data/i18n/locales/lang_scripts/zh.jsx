import zhLocaleData from 'react-intl/locale-data/en';
import { addLocaleData } from 'react-intl';

import messages from '../json/zh_CN.json'

export default class SFELanguage {
  render() {
    addLocaleData(zhLocaleData);
    return (
      <script type="application/json" id="SFE_i18n_messages">
        { messages }
      </script>
    );
  }
}
