// TODO: remove once https://github.com/facebook/jest/issues/4545 is resolved
// workaround is provided by https://github.com/facebook/jest/issues/4545#issuecomment-333004504
global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
};
