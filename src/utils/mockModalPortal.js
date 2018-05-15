/* eslint-disable func-names */

// Dirty work-around until Enzyme fully supports React Portals rendered with shallow()
// See: https://github.com/airbnb/enzyme/issues/1507
// Idea for this taken from:
// https://github.com/mui-org/material-ui/commit/aa10940b584239dce62ae5fd1d6c379ddf66b663

// mockPortal.init() mocks the render() function of Paragon's Modal so that it renders directly
// without a Portal.
// mockPortal.reset() returns the render() function back to normal.

import { Modal } from '@edx/paragon';

const modalOrigin = {};

const mockModalPortal = {
  init: () => {
    modalOrigin.render = Modal.prototype.render;
    Modal.prototype.render = function () {
      return this.renderModal();
    };
  },
  reset: () => {
    if (modalOrigin.render) {
      Modal.prototype.render = modalOrigin.render;
    }
  },
};

export default mockModalPortal;
