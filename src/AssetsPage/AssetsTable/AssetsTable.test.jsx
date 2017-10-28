import React from 'react';
import { mount, shallow } from 'enzyme';
import { AssetsTable } from './index';

import { assetActions } from '../../data/constants/actionTypes';

const setAssetToDelete = (asset, wrapper) => {
  wrapper.setState({ assetToDelete: asset });
};
const clearStatus = (wrapper) => {
  wrapper.setProps({ assetsStatus: {} });
};
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
  assetsStatus: {},
  deleteAsset: () => {},
  updateSort: () => {},
  clearAssetsStatus: () => {},
};

let wrapper;

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

describe('it displays alert properly', () => {
  it('renders info alert', () => {
    wrapper = mount(
      <AssetsTable
        {...defaultProps}
      />,
    );
    const statusAlert = wrapper.find('StatusAlert');
    const statusAlertType = statusAlert.prop('alertType');

    expect(statusAlertType).toEqual('info');
    expect(statusAlert.find('div').first().hasClass('alert-info')).toEqual(true);
  });

  it('renders success alert on success', () => {
    wrapper = mount(
      <AssetsTable
        {...defaultProps}
      />,
    );

    wrapper.setProps({
      assetsStatus: {
        response: {},
        type: assetActions.DELETE_ASSET_SUCCESS,
      },
    });
    const statusAlert = wrapper.find('StatusAlert');
    const statusAlertType = statusAlert.prop('alertType');

    expect(statusAlertType).toEqual('success');
    expect(statusAlert.find('div').first().hasClass('alert-success')).toEqual(true);
  });

  it('renders danger alert on error', () => {
    wrapper = mount(
      <AssetsTable
        {...defaultProps}
      />,
    );

    wrapper.setProps({
      assetsStatus: {
        response: {},
        type: assetActions.ASSET_XHR_FAILURE,
      },
    });
    const statusAlert = wrapper.find('StatusAlert');
    const statusAlertType = statusAlert.prop('alertType');

    expect(statusAlertType).toEqual('danger');
    expect(statusAlert.find('div').first().hasClass('alert-danger')).toEqual(true);
  });

  it('shows the alert on open', () => {
    wrapper = mount(
      <AssetsTable
        {...defaultProps}
      />,
    );
    const statusAlert = wrapper.find('StatusAlert');

    wrapper.setState({ statusAlertOpen: true });
    expect(statusAlert.find('div').first().prop('hidden')).toEqual(false);
  });

  it('hides the alert on close', () => {
    wrapper = mount(
      <AssetsTable
        {...defaultProps}
      />,
    );
    const statusAlert = wrapper.find('StatusAlert');

    wrapper.setState({ statusAlertOpen: true });
    expect(statusAlert.find('div').first().prop('hidden')).toEqual(false);
    wrapper.setState({ statusAlertOpen: false });
    expect(statusAlert.find('div').first().prop('hidden')).toEqual(true);
  });

  it('closes the alert on keyDown', () => {
    wrapper = mount(
      <AssetsTable
        {...defaultProps}
      />,
    );
    wrapper.setProps({
      clearAssetsStatus: () => clearStatus(wrapper),
    });

    const statusAlert = wrapper.find('StatusAlert');
    wrapper.setState({ statusAlertOpen: true });
    setAssetToDelete(wrapper.props().assetsList[0], wrapper);
    statusAlert.find('button').at(0).simulate('keyDown', { key: 'Enter' });
    expect(wrapper.state().statusAlertOpen).toEqual(false);
    expect(statusAlert.find('div').first().prop('hidden')).toEqual(true);
  });

  it('clears assetsStatus correctly', () => {
    wrapper = mount(
      <AssetsTable
        {...defaultProps}
      />,
    );
    wrapper.setProps({
      clearAssetsStatus: () => clearStatus(wrapper),
    });

    const statusAlert = wrapper.find('StatusAlert');
    wrapper.setState({ statusAlertOpen: true });
    setAssetToDelete(wrapper.props().assetsList[0], wrapper);
    statusAlert.find('button').at(0).simulate('keyDown', { key: 'Enter' });
    expect(wrapper.props().assetsStatus).toEqual({});
  });

  it('uses the display_name for asset delete message', () => {
    wrapper = mount(
      <AssetsTable
        {...defaultProps}
      />,
    );
    const statusAlertDialog = wrapper.find('.alert-dialog');
    const fileName = 'testFile';

    setAssetToDelete({ display_name: fileName }, wrapper);
    expect(statusAlertDialog.text()).toContain(fileName);
  });
});
