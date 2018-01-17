import React from 'react';
import Enzyme from 'enzyme';
import { AssetsPage } from './index';

const { shallow } = Enzyme;

let wrapper;

const defaultProps = {
  assetsList: [{
    display_name: 'a.txt',
  }],
  uploadSettings: {
    max_file_size_in_mbs: 1,
  },
  request: {},
  courseDetails: {},
  getAssets: () => {},
};

describe('<AssetsPage />', () => {
  describe('with assets', () => {
    beforeEach(() => {
      wrapper = shallow(
        <AssetsPage
          {...defaultProps}
        />,
      );
    });
    describe('renders', () => {
      it('AssetsDropZone', () => {
        expect(wrapper.find('Connect(AssetsDropZone)')).toHaveLength(1);
      });
      it('AssetsFilters', () => {
        expect(wrapper.find('Connect(AssetsFilters)')).toHaveLength(1);
      });
      it('AssetsTable', () => {
        expect(wrapper.find('Connect(AssetsTable)')).toHaveLength(1);
      });
      it('Pagination', () => {
        expect(wrapper.find('Connect(Pagination)')).toHaveLength(1);
      });
      it('with correct markup structure', () => {
        const page = wrapper.find('.container .row .col');
        expect(page).toHaveLength(1);

        expect(page.find('Connect(AssetsDropZone)')).toHaveLength(1);
        expect(page.find('Connect(AssetsFilters)')).toHaveLength(1);

        const body = wrapper.find('.col-10');
        expect(body).toHaveLength(1);
        expect(body.find('Connect(AssetsTable)')).toHaveLength(1);
        expect(body.find('Connect(Pagination)')).toHaveLength(1);
      });
    });
    describe('has correct state', () => {
      it('hasAssets', () => {
        expect(wrapper.state('hasAssets')).toEqual(true);
      });
    });
    describe('has correct behavior', () => {
      it('when assetsList prop changes to empty', () => {
        wrapper.setProps({
          assetsList: [],
        });

        expect(wrapper.state('hasAssets')).toEqual(false);
      });
    });
  });
  describe('without assets', () => {
    const props = {
      ...defaultProps,
      assetsList: [],
    };

    beforeEach(() => {
      wrapper = shallow(
        <AssetsPage
          {...props}
        />,
      );
    });
    describe('renders', () => {
      it('AssetsDropZone', () => {
        expect(wrapper.find('Connect(AssetsDropZone)')).toHaveLength(1);
      });
      it('noAssetsBody', () => {
        const body = wrapper.find('.container .row .col-10');

        expect(body.find('h3').text()).toEqual('0 files in your course');
        expect(body.find('h4').text()).toEqual('Enhance your course content by uploading files such as images and documents.');
      });
      it('with correct markup structure', () => {
        const page = wrapper.find('.container .row .col');
        expect(page).toHaveLength(1);

        expect(page.find('Connect(AssetsDropZone)')).toHaveLength(1);

        const body = wrapper.find('.col-10');
        expect(body).toHaveLength(1);
        expect(body.find('h3')).toHaveLength(1);
        expect(body.find('h4')).toHaveLength(1);
      });
    });
    describe('has correct state', () => {
      it('hasAssets', () => {
        expect(wrapper.state('hasAssets')).toEqual(false);
      });
    });
    describe('has correct behavior', () => {
      it('when assetsList prop changes to non-empty', () => {
        wrapper.setProps({
          assetsList: defaultProps.assetsList,
        });

        expect(wrapper.state('hasAssets')).toEqual(true);
      });
    });
  });
  describe('getAssets', () => {
    const getAssetsMock = jest.fn();
    const props = {
      ...defaultProps,
      getAssets: getAssetsMock,
    };

    beforeEach(() => {
      wrapper = shallow(
        <AssetsPage
          {...props}
        />,
      );

      getAssetsMock.mockReset();
    });
    it('is called on changes to request', () => {
      const request = {
        request: 'request',
      };

      wrapper.setProps({
        request,
      });

      expect(getAssetsMock).toHaveBeenCalledTimes(1);
      expect(getAssetsMock).toHaveBeenCalledWith(request, props.courseDetails);
    });
    it('is not called on no changes to request', () => {
      wrapper.setProps({
        request: props.request,
      });

      expect(getAssetsMock).toHaveBeenCalledTimes(0);
    });
  });
});
