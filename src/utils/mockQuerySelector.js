// document.querySelector does not work with Enzyme. It will always return null.
// init() mocks the function for the duration of the test by returning a div created on the <body>.
// reset() deletes the div from the body and unmocks the document.querySelector back to normal.

let parentElement;
let querySelector;

const mockQuerySelector = {
  init: () => {
    querySelector = document.querySelector;
    parentElement = document.createElement('div');
    document.body.appendChild(parentElement);
    document.querySelector = () => parentElement;
  },
  reset: () => {
    parentElement.remove();
    document.querySelector = querySelector;
  },
};

export default mockQuerySelector;
