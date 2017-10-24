import React from 'react';
import { mount, shallow } from 'enzyme';
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
  updateSort: () => {},
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
  it('has the correct initial sort state', () => {
    wrapper = shallow(
      <AssetsTable
        {...defaultProps}
      />,
    );
    expect(wrapper.find('Table')).toHaveLength(1);
    expect(wrapper.find('Table').shallow().find('thead')).toHaveLength(1);
    expect(wrapper.find('Table').shallow().find('thead').shallow().find('Button')).toHaveLength(4);

    const tableColumns = wrapper.state('tableColumns');

    expect(wrapper.find('Table').shallow().find('th').filter('Type')).toHaveLength(0);

    console.log(wrapper.find('Table').shallow().find('th').at(0).contains('<span> Name </span>'));
    console.log(wrapper.find('Table').shallow().find('th').at(0).html());
    console.log(wrapper.find('Table').shallow().find('th').at(0).props());
    // console.log(wrapper.find('Table').shallow().find('th').at(0).prop['scope']);
    // wrapper.find('Table').shallow().find('thead').shallow().find('Button').forEach((node) => {
    //   console.log(node.state('display'));
    //   // const isSortable = tableColumns[]
    //   // console.log(isSortable);
    // });

    // expect(wrapper.find('Table').shallow()
    //   .find('Button')).toHaveLength(4);

    // wrapper.find('Table').shallow().find('th').shallow().find('Button').forEach((node) => {

    // });


  });
});
