import React from 'react';
import { mount } from 'enzyme';
import { AssetsTable } from './index';

import { assetActions } from '../../data/constants/actionTypes';

const setAssetToDelete = (asset, wrapper) => {
  wrapper.setState({ deletedAsset: asset });
};

const clearStatus = (wrapper) => {
  wrapper.setProps({ assetsStatus: {} });
};

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
    {
      display_name: 'fish.doc',
      id: 'fish.doc',
    },
  ],
  assetsParameters: {
    courseId: 'test-course',
    page: '0',
    pageSize: '50',
  },
  assetsStatus: {},
  clearAssetsStatus: () => {},
  deleteAsset: () => {},
  updateSort: () => {},
};

describe('<AssetsTable />', () => {
  describe('renders', () => {
    beforeEach(() => {
      wrapper = mount(
        <AssetsTable
          {...defaultProps}
        />,
      );
    });
    it(' correct number of assets', () => {
      // + 1 because it includes row item for headings
      expect(wrapper.find('tr')).toHaveLength(defaultProps.assetsList.length + 1);
    });
    it('correct number of trashcan buttons', () => {
      expect(wrapper.find('button').filterWhere(button => button.hasClass('fa-trash'))).toHaveLength(defaultProps.assetsList.length);
    });
  });
  describe('onSortClick', () => {
    let updateSortSpy;

    beforeEach(() => {
      updateSortSpy = jest.fn();
    });

    const sortableAssetProps = [
      {
        sort: 'date_added',
        direction: 'desc',
      },
      {
        sort: 'date_added',
        direction: 'asc',
      },
      {
        sort: 'date_added',
        direction: 'desc',
      },
    ];

    const assertValues = [
      {
        buttonIndexToClick: 2,
        buttonToClickText: 'Date Added',
        onSortColumnParameter: 'date_added',
        onSortDirectionParameter: 'asc',
      },
      {
        buttonIndexToClick: 2,
        buttonToClickText: 'Date Added',
        onSortColumnParameter: 'date_added',
        onSortDirectionParameter: 'desc',
      },
      {
        buttonIndexToClick: 0,
        buttonToClickText: 'Name',
        onSortColumnParameter: 'display_name',
        onSortDirectionParameter: 'desc',
      },
    ];

    sortableAssetProps.forEach((sortableAssetProp, index) => {
      it(`calls onSort function with ${sortableAssetProp.direction} click on ${sortableAssetProp.sort === 'date_added' ? 'same' : 'different'} column`, () => {
        const sortableAssetParameters = {
          ...defaultProps.assetsParameters,
          ...sortableAssetProp,
        };

        const testValues = assertValues[index];

        wrapper = mount(
          <AssetsTable
            {...defaultProps}
            updateSort={updateSortSpy}
            assetsParameters={sortableAssetParameters}
          />,
        );

        const sortButtons = wrapper.find('button').filterWhere(button => (
          button.find('span > span .fa-sort').exists() ||
          button.find('span > span .fa-sort-desc').exists() ||
          button.find('span > span .fa-sort-asc').exists()
        ));

        expect(sortButtons).toHaveLength(3);

        expect(sortButtons.at(testValues.buttonIndexToClick).filterWhere(button => (
          button.text().includes(testValues.buttonToClickText)
        ))).toHaveLength(1);

        sortButtons.at(testValues.buttonIndexToClick).simulate('click');

        expect(updateSortSpy).toHaveBeenCalledTimes(1);
        expect(updateSortSpy).toHaveBeenLastCalledWith(
          testValues.onSortColumnParameter,
          testValues.onSortDirectionParameter,
        );
      });
    });
  });
  describe('modal', () => {
    let modal;

    beforeEach(() => {
      wrapper = mount(
        <AssetsTable
          {...defaultProps}
        />,
      );
      modal = wrapper.find('[role="dialog"]');
    });
    it('renders', () => {
      expect(modal).toHaveLength(1);
    });
    it('is closed by default', () => {
      expect(modal.hasClass('modal-open')).toEqual(false);
      expect(wrapper.state('modalOpen')).toEqual(false);
    });
    it('opens when trash button clicked; modalOpen state is true', () => {
      const trashButtons = wrapper.find('button').filterWhere(button => button.hasClass('fa-trash'));
      expect(trashButtons).toHaveLength(defaultProps.assetsList.length);

      trashButtons.at(0).simulate('click');

      expect(modal.hasClass('modal-open')).toEqual(true);
      expect(wrapper.state('modalOpen')).toEqual(true);
    });
    it('closes when Cancel button clicked; modalOpen state is false', () => {
      const trashButtons = wrapper.find('button').filterWhere(button => button.hasClass('fa-trash'));
      trashButtons.at(0).simulate('click');

      const closeButton = modal.find('button').filterWhere(
        button => button.matchesElement(<button>Cancel</button>));
      expect(closeButton).toHaveLength(1);

      closeButton.at(0).simulate('click');

      expect(wrapper.state('modalOpen')).toEqual(false);
    });
  });
  describe('deleteAsset', () => {
    it('calls deleteAsset function prop correctly', () => {
      const deleteAssetSpy = jest.fn();

      wrapper = mount(
        <AssetsTable
          {...defaultProps}
          deleteAsset={deleteAssetSpy}
        />,
      );

      const deleteButtons = wrapper.find('button');
      const trashButtons = deleteButtons.filterWhere(button => button.hasClass('fa-trash'));
      const deleteButton = deleteButtons.filterWhere(button =>
        button.matchesElement(<button>Yes, delete.</button>));

      trashButtons.at(0).simulate('click');
      deleteButton.at(0).simulate('click');

      expect(deleteAssetSpy).toHaveBeenCalledTimes(1);
      expect(deleteAssetSpy).toHaveBeenCalledWith(
        defaultProps.assetsParameters,
        defaultProps.assetsList[0].id,
      );
    });
    it('closes on deleteAsset call', () => {
      wrapper = mount(
        <AssetsTable
          {...defaultProps}
        />,
      );

      const deleteButtons = wrapper.find('button');

      const trashButtons = deleteButtons.filterWhere(button => button.hasClass('fa-trash'));
      const modal = wrapper.find('[role="dialog"]');

      const deleteButton = deleteButtons.filterWhere(button =>
        button.matchesElement(<button>Yes, delete.</button>));

      trashButtons.at(0).simulate('click');

      deleteButton.at(0).simulate('click');

      expect(modal.hasClass('modal-open')).toEqual(false);
      expect(wrapper.state('modalOpen')).toEqual(false);
    });
  });
  describe('onDeleteClick', () => {
    let trashButtons;

    beforeEach(() => {
      wrapper = mount(
        <AssetsTable
          {...defaultProps}
        />,
      );

      trashButtons = wrapper.find('button').filterWhere(button => button.hasClass('fa-trash'));
    });
    it('sets modalOpen to true', () => {
      trashButtons.at(0).simulate('click');
      expect(wrapper.state('modalOpen')).toEqual(true);
    });
    it('sets assetToDelete correctly', () => {
      const trashButtonAriaLabel = `Delete ${defaultProps.assetsList[0].display_name}`;
      expect(trashButtons.at(0).prop('aria-label')).toEqual(trashButtonAriaLabel);

      trashButtons.at(0).simulate('click');
      expect(wrapper.state('assetToDelete')).toEqual(defaultProps.assetsList[0]);
    });
    it('sets elementToFocusOnModalClose correctly', () => {
      trashButtons.at(0).simulate('click');

      expect(trashButtons.at(0).matchesElement(wrapper.state('elementToFocusOnModalClose'))).toEqual(true);
    });
  });
  describe('focus', () => {
    let closeButton;
    let deleteButtons;
    let modal;
    let trashButtons;
    let mockDeleteAsset;

    beforeEach(() => {
      wrapper = mount(
        <AssetsTable
          {...defaultProps}
        />,
      );

      deleteButtons = wrapper.find('button');
      trashButtons = deleteButtons.find('button').filterWhere(button => button.hasClass('fa-trash'));

      modal = wrapper.find('[role="dialog"]');
      closeButton = modal.find('button').filterWhere(button => button.matchesElement(<button><span>&times;</span></button>));
    });

    it('moves from modal to trashcan on modal close', () => {
      trashButtons.at(0).simulate('click');

      expect(closeButton.at(0).matchesElement(document.activeElement)).toEqual(true);

      closeButton.at(0).simulate('click');

      expect(trashButtons.at(0).matchesElement(document.activeElement)).toEqual(true);
    });

    it('moves from modal to status alert on asset delete', () => {
      const deleteButton = deleteButtons.filterWhere(button =>
        button.matchesElement(<button>Yes, delete.</button>));

      const statusAlert = wrapper.find('StatusAlert');
      const closeStatusAlertButton = statusAlert.find('button').filterWhere(button => button.matchesElement(<button><span>&times;</span></button>));

      trashButtons.at(0).simulate('click');

      expect(closeButton.at(0).matchesElement(document.activeElement)).toEqual(true);

      deleteButton.at(0).simulate('click');

      expect(closeStatusAlertButton.at(0).matchesElement(document.activeElement)).toEqual(true);
    });
    it('moves to correct asset trashcan icon after first asset deleted', () => {
      const assetToDeleteId = defaultProps.assetsList[0].id;

      mockDeleteAsset = jest.fn(() => {
        wrapper.setProps({ assetsList: defaultProps.assetsList.filter(asset => asset.id !== assetToDeleteId), assetsStatus: { type: 'DELETE_ASSET_SUCCESS' } });
      });

      wrapper.setProps({ deleteAsset: mockDeleteAsset });

      const deleteButton = deleteButtons.filterWhere(button =>
        button.matchesElement(<button>Yes, delete.</button>));

      const statusAlert = wrapper.find('StatusAlert');
      const closeStatusAlertButton = statusAlert.find('button').filterWhere(button => button.matchesElement(<button><span>&times;</span></button>));

      trashButtons.at(0).simulate('click');

      deleteButton.at(0).simulate('click');
      expect(mockDeleteAsset).toHaveBeenCalledTimes(1);

      closeStatusAlertButton.at(0).simulate('click');

      expect(mockDeleteAsset).toHaveBeenCalledTimes(1);
      expect(mockDeleteAsset).toHaveBeenCalledWith(defaultProps.assetsParameters, assetToDeleteId);
      expect(trashButtons.at(0).matchesElement(document.activeElement)).toEqual(true);
    });
    it('moves to correct asset trashcan icon after nth asset deleted', () => {
      const assetToDeleteId = defaultProps.assetsList[2].id;

      mockDeleteAsset = jest.fn(() => {
        wrapper.setProps({ assetsList: defaultProps.assetsList.filter(asset => asset.id !== assetToDeleteId), assetsStatus: { type: 'DELETE_ASSET_SUCCESS' } });
      });

      wrapper.setProps({ deleteAsset: mockDeleteAsset });

      const deleteButton = deleteButtons.filterWhere(button =>
        button.matchesElement(<button>Yes, delete.</button>));

      const statusAlert = wrapper.find('StatusAlert');
      const closeStatusAlertButton = statusAlert.find('button').filterWhere(button => button.matchesElement(<button><span>&times;</span></button>));

      trashButtons.at(2).simulate('click');

      deleteButton.at(0).simulate('click');
      expect(mockDeleteAsset).toHaveBeenCalledTimes(1);
      closeStatusAlertButton.at(0).simulate('click');

      expect(mockDeleteAsset).toHaveBeenCalledTimes(1);
      expect(mockDeleteAsset).toHaveBeenCalledWith(defaultProps.assetsParameters, assetToDeleteId);
      expect(trashButtons.at(1).matchesElement(document.activeElement)).toEqual(true);
    });
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
