import React from 'react';
import { Button, Modal } from '@edx/paragon';

import AssetsUploadConfirm from './index';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';
import mockQuerySelector from '../../utils/mockQuerySelector';

const defaultProps = {
  files: [],
  uploadAssets: () => { },
  clearPreUploadProps: () => {},
  courseDetails: {},
  preUploadError: [],
};

const modalIsClosed = (wrapper) => {
  expect(wrapper.prop('preUploadError')).toEqual([]);
  expect(wrapper.state('modalOpen')).toEqual(false);
  expect(wrapper.find(Modal).prop('open')).toEqual(false);
};

const modalIsOpen = (wrapper) => {
  expect(wrapper.prop('preUploadError')).toBeTruthy();
  expect(wrapper.state('modalOpen')).toEqual(true);
  expect(wrapper.find(Modal).prop('open')).toEqual(true);
};

const errorMessageHasCorrectFiles = (wrapper, files) => {
  const preUploadError = wrapper.prop('preUploadError');
  files.forEach((file) => {
    expect(preUploadError).toContain(file);
  });
};

let wrapper;

describe('AssetsUploadConfirm', () => {
  beforeEach(() => {
    mockQuerySelector.init();
  });
  afterEach(() => {
    mockQuerySelector.reset();
  });

  describe('renders', () => {
    beforeEach(() => {
      wrapper = mountWithIntl(
        <AssetsUploadConfirm
          {...defaultProps}
        />,
      );
    });

    it('closed by default', () => {
      modalIsClosed(wrapper);
    });

    it('open if there is an error message', () => {
      wrapper.setProps({
        preUploadError: ['asset.jpg'],
      });

      modalIsOpen(wrapper);
      errorMessageHasCorrectFiles(wrapper, ['asset.jpg']);
    });
  });
  describe('behaves', () => {
    it('Overwrite calls uploadAssets', () => {
      const mockUploadAssets = jest.fn();
      const files = [new File([''], 'file1')];
      const courseDetails = {
        id: 'course-v1:edX+DemoX+Demo_Course',
      };
      wrapper.setProps({
        files,
        courseDetails,
        uploadAssets: mockUploadAssets,
      });

      wrapper.find(Button).filterWhere(button => button.text() === 'Overwrite').simulate('click');
      expect(mockUploadAssets).toBeCalledWith(files, courseDetails);
    });

    it('clicking cancel button closes the status alert', () => {
      wrapper.setProps({
        preUploadError: ['asset.jpg'],
        clearPreUploadProps: () => {
          wrapper.setProps({
            ...defaultProps,
          });
        },
      });

      const modal = wrapper.find(Modal);
      const cancelModalButton = modal.find('button').filterWhere(button => button.text() === 'Cancel');
      cancelModalButton.simulate('click');
      modalIsClosed(wrapper);
    });
  });
});
