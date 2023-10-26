import React from 'react';
import { Button, Modal } from '@edx/paragon';

import AssetsUploadConfirm from './index';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';
import mockQuerySelector from '../../utils/mockQuerySelector';

const defaultProps = {
  filesToUpload: [],
  uploadAssets: () => { },
  clearUploadConfirmProps: () => {},
  courseDetails: {},
  filenameConflicts: [],
};

const modalIsClosed = (wrapper) => {
  expect(wrapper.prop('filenameConflicts')).toEqual([]);
  expect(wrapper.state('modalOpen')).toEqual(false);
  expect(wrapper.find(Modal).prop('open')).toEqual(false);
};

const modalIsOpen = (wrapper) => {
  expect(wrapper.prop('filenameConflicts')).toBeTruthy();
  expect(wrapper.state('modalOpen')).toEqual(true);
  expect(wrapper.find(Modal).prop('open')).toEqual(true);
};

const errorMessageHasCorrectFiles = (wrapper, files) => {
  const filenameConflicts = wrapper.prop('filenameConflicts');
  files.forEach((file) => {
    expect(filenameConflicts).toContain(file);
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
        filenameConflicts: ['asset.jpg'],
      });

      modalIsOpen(wrapper);
      errorMessageHasCorrectFiles(wrapper, ['asset.jpg']);
    });
  });
  describe('behaves', () => {
    it('Overwrite calls uploadAssets', () => {
      const mockUploadAssets = jest.fn();
      const filesToUpload = [new File([''], 'file1')];
      const courseDetails = {
        id: 'course-v1:edX+DemoX+Demo_Course',
      };
      wrapper.setProps({
        filesToUpload,
        courseDetails,
        uploadAssets: mockUploadAssets,
      });

      wrapper.find(Button).filterWhere(button => button.text() === 'Overwrite').simulate('click');
      expect(mockUploadAssets).toBeCalledWith(filesToUpload, courseDetails);
    });

    it('clicking cancel button closes the status alert', () => {
      wrapper.setProps({
        filenameConflicts: ['asset.jpg'],
        clearUploadConfirmProps: () => {
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
