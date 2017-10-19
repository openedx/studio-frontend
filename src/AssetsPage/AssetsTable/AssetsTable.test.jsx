import React from 'react';
import { mount } from 'enzyme';
import { AssetsTable } from './index';

let wrapper;

const defaultProps = {
  assetsList: [
    {
      display_name: 'cat.jpg',
      id: 'cat.jpg',
    },
    {
      display_name: 'dog.png',
      id: 'dog.png',
    },
    {
      display_name: 'bird.json',
      id: 'bird.json',
    },
  ],
  assetsParameters: {
    assetTypes: {
      courseId: 'test-course',
      page: '0',
      pageSize: '50',
      sort: 'sort',
    },
  },
  deleteAsset: () => {},
};

describe('<AssetsTable />', () => {
  it('renders correct number of assets', () => {
    wrapper = mount(
      <AssetsTable
        {...defaultProps}
      />,
    );
    // + 1 because it includes row item for headings
    expect(wrapper.find('tr')).toHaveLength(defaultProps.assetsList.length + 1);
  });
});
