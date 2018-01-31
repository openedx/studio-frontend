import React from 'react';

import AssetsDropZone from './index';
import courseDetails from '../../utils/testConstants';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';

const defaultProps = {
  uploadAssets: () => {},
  uploadExceedMaxCount: () => {},
  uploadExceedMaxSize: () => {},
  maxFileSizeMB: 87,
  maxFileCount: 3,
  courseDetails,
};

let wrapper;

describe('<AssetsDropZone />', () => {
  beforeEach(() => {
    wrapper = mountWithIntl(
      <AssetsDropZone
        {...defaultProps}
      />,
    );
  });

  describe('renders', () => {
    it('contains file browser button', () => {
      expect(wrapper.find('button').text()).toEqual('Browse your computer');
    });
    it('hides the icon from screen readers', () => {
      expect(wrapper.find('[aria-hidden=true]').length).toBe(1);
    });
  });

  describe('onDrop', () => {
    it('rejects too many files', () => {
      const mockUploadExceedMaxCount = jest.fn();
      wrapper.setProps({
        uploadExceedMaxCount: mockUploadExceedMaxCount,
      });
      wrapper.instance().onDrop([{}], [{}, {}, {}]);
      expect(mockUploadExceedMaxCount).toBeCalled();
    });
    it('call uploadExceedMaxSize() for any rejected files', () => {
      const mockUploadExceedMaxSize = jest.fn();
      wrapper.setProps({
        uploadExceedMaxSize: mockUploadExceedMaxSize,
      });
      wrapper.instance().onDrop([{}, {}], [{}]);
      expect(mockUploadExceedMaxSize).toBeCalled();
    });
    it('call uploadAssets() for successful uploads', () => {
      const mockUploadAssets = jest.fn();
      wrapper.setProps({
        uploadAssets: mockUploadAssets,
      });
      wrapper.instance().onDrop([{}, {}], []);
      expect(mockUploadAssets).toBeCalled();
    });
  });

  describe('Browser Button', () => {
    it('call dropzone open()', () => {
      const mockDropZoneOpen = jest.fn();
      wrapper.instance().dropzoneRef.open = mockDropZoneOpen;

      const button = wrapper.find('button');
      button.simulate('click');
      expect(mockDropZoneOpen).toBeCalled();
    });
  });
});
