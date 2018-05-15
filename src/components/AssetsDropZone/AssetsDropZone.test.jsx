import React from 'react';

import AssetsDropZone from './index';
import { courseDetails } from '../../utils/testConstants';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';

const defaultProps = {
  uploadAssets: () => {},
  uploadExceedMaxCount: () => {},
  uploadExceedMaxSize: () => {},
  uploadInvalidFileType: () => {},
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
    it('hides the icon & upload file size from screen readers', () => {
      expect(wrapper.find('[aria-hidden=true]').length).toBe(2);
    });
    it('non-compact version of the dropzone', () => {
      const dropZoneID = '[data-identifier="asset-drop-zone"]';
      expect(wrapper.find(dropZoneID).at(0).hasClass('drop-zone')).toEqual(true);
    });
    it('compact version of the dropzone', () => {
      const dropZoneID = '[data-identifier="asset-drop-zone"]';
      wrapper.setProps({
        compactStyle: true,
      });
      expect(wrapper.find(dropZoneID).at(0).hasClass('drop-zone-compact')).toEqual(true);
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
    it('call uploadExceedMaxSize() for too large rejected files', () => {
      const mockUploadExceedMaxSize = jest.fn();
      wrapper.setProps({
        uploadExceedMaxSize: mockUploadExceedMaxSize,
      });
      wrapper.instance().onDrop([{}, {}], [{ size: (wrapper.prop('maxFileSizeMB') + 1) * 1000000 }]);
      expect(mockUploadExceedMaxSize).toBeCalled();
    });
    it('call uploadInvalidFileType() for non-size rejected files', () => {
      const mockUploadInvalidFileType = jest.fn();
      wrapper.setProps({
        uploadInvalidFileType: mockUploadInvalidFileType,
      });
      wrapper.instance().onDrop([{}, {}], [{}]);
      expect(mockUploadInvalidFileType).toBeCalled();
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
      wrapper.instance().dropZoneRef.open = mockDropZoneOpen;

      const button = wrapper.find('button');
      button.simulate('click');
      expect(mockDropZoneOpen).toBeCalled();
    });
  });
});
