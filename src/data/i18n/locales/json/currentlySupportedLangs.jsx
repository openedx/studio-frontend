import 'react-intl/locale-data/ar';
import 'react-intl/locale-data/es';
import 'react-intl/locale-data/fr';
import 'react-intl/locale-data/zh';

import './ar.json';
import './es_419.json';
import './fr.json';
import './zh_CN.json';

// Methodology: These languages (plus the default english) are the only ones that appear on edx.org
// This was determined by inspecting the 'released_languages' method in the following file:
//    https://github.com/edx/edx-platform/blob/master/openedx/core/djangoapps/lang_pref/api.py
//
// Further, I hit the read replica in order to confirm the live values, which are currently:
//    en, fr, zh-cn, es-419, ar
