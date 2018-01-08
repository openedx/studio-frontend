// translationRunner.js
const manageTranslations = require('react-intl-translations-manager').default;

manageTranslations({
  messagesDirectory: 'src/data/i18n/default/',
  translationsDirectory: 'src/data/i18n/locales',
  languages: ['fr'], // any translation---don't include the default language
});
