// This file contains all of the strings that our HelloWorld component would need to display in the
// UI.  We separate these from the main component file so every string can have an ID for our
// translations service.
import { defineMessages } from 'react-intl';

// id: gives the display message a unique id for the translation service
// defaultMessage: the string in English that will be translated
// description: a description for the translators that is sent along with the defaultMessage
const messages = defineMessages({
  helloWorld: {
    id: 'helloWorld',
    defaultMessage: 'Hello, world!',
    description: 'Says hello to the world!',
  },
  helloWorldModalTitle: {
    id: 'helloWorldModalTitle',
    defaultMessage: 'Hello Modal',
    description: 'Title of a modal.',
  },
});

export default messages;
