// translationRunner.js
const manageTranslations = require('react-intl-translations-manager').default;

manageTranslations({
  messagesDirectory: 'i18n/default/',
  translationsDirectory: 'i18n/locales',
  languages: ['fr'], // any translation---don't include the default language
});
