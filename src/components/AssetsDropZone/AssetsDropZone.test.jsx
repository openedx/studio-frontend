import React from 'react';
import Enzyme from 'enzyme';
import { AssetsDropZone } from './index';

const mount = Enzyme.mount;
const defaultProps = {
  uploadAssets: () => {},
  uploadExceedMaxCount: () => {},
  uploadExceedMaxSize: () => {},
  maxFileSizeMB: 87,
  maxFileCount: 3,
  courseDetails: {
    lang: 'en',
    url_name: 'course',
    name: 'edX Demonstration Course',
    display_course_number: '',
    num: 'DemoX',
    org: 'edX',
    id: 'course-v1:edX+DemoX+Demo_Course',
    revision: '',
    base_url: 'sfe',
  },
};

let wrapper;

describe('<AssetsDropZone />', () => {
  beforeEach(() => {
    wrapper = mount(
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
