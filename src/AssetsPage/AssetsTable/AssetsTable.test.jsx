import React from 'react';
import { mount } from 'enzyme';
import { AssetsTable } from './index';

import { assetActions } from '../../data/constants/actionTypes';

const setAssetToDelete = (asset, wrapper) => {
  wrapper.setState({ assetToDelete: asset });
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
    it(' correct number of assets', () => {
      wrapper = mount(
        <AssetsTable
          {...defaultProps}
        />,
      );
      // + 1 because it includes row item for headings
      expect(wrapper.find('tr')).toHaveLength(defaultProps.assetsList.length + 1);
    });
    it('correct number of trashcan buttons', () => {
      wrapper = mount(
        <AssetsTable
          {...defaultProps}
        />,
      );

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
    it('renders', () => {
      const modal = wrapper.find('[role="dialog"]');
      expect(modal).toHaveLength(1);
    });
    it('is closed by default', () => {
      wrapper = mount(
        <AssetsTable
          {...defaultProps}
        />,
      );

      const modal = wrapper.find('[role="dialog"]');

      expect(modal.hasClass('modal-open')).toEqual(false);
      expect(wrapper.state('modalOpen')).toEqual(false);
    });
    it('opens when trash button clicked; modalOpen state is true', () => {
      wrapper = mount(
        <AssetsTable
          {...defaultProps}
        />,
      );

      const modal = wrapper.find('[role="dialog"]');

      const trashButtons = wrapper.find('button').filterWhere(button => button.hasClass('fa-trash'));
      expect(trashButtons).toHaveLength(3);

      trashButtons.at(0).simulate('click');

      expect(modal.hasClass('modal-open')).toEqual(true);
      expect(wrapper.state('modalOpen')).toEqual(true);
    });
    it('closes when Cancel button clicked; modalOpen state is false', () => {
      wrapper = mount(
        <AssetsTable
          {...defaultProps}
        />,
      );

      const trashButtons = wrapper.find('button').filterWhere(button => button.hasClass('fa-trash'));
      trashButtons.at(0).simulate('click');

      const modal = wrapper.find('[role="dialog"]');
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

    // const deleteAsset = (assetsParameters, assetId) => {
        //this.props.assetsList.filter(asset => asset.id !== assetId);
        // this.props.assetsList.filter(asset => (asset.id !== assetId));
      // props.assetsList.filter(asset => (asset.id !== assetId));
    // };

    beforeEach(() => {
      mockDeleteAsset = jest.fn((x, y) => {
        console.log('it is me!');
        // this.props.assetList.filter(asset => asset.id !== y);
        wrapper.setProps({ assetsList: defaultProps.assetsList.filter(asset => asset.id !== 'cat.jpg') });
      });

      wrapper = mount(
        <AssetsTable
          {...defaultProps}
          deleteAsset={mockDeleteAsset}
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
      // const deletedAssetId = defaultProps.assetsList[0].id;
      // console.log(deletedAssetId);

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
      // const mockDeleteAsset = jest.fn((x, y) => {
      //   console.log('it is me!');
      //   this.props.assetList.filter(asset => asset.id !== y);
      // });
        // wrapper.setProps({ assetsList: defaultProps.assetsList.filter(asset => asset.id !== 'cat.jpg') }),
      // );

      // wrapper = mount(
      //   <AssetsTable
      //     {...defaultProps}
      //     // deleteAsset={mockDeleteAsset}
      //     // deleteAsset={() => mockDeleteAsset()}
      //   />,
      // );

      // wrapper.deleteAsset = mockDeleteAsset;

      // expect(wrapper.prop('deleteAsset')).toEqual(mockDeleteAsset);


      // console.log(mockDeleteAsset(1,2));

      const deleteButton = deleteButtons.filterWhere(button =>
        button.matchesElement(<button>Yes, delete.</button>));

      const nextFocusElement = trashButtons.at(1);

      const statusAlert = wrapper.find('StatusAlert');
      const closeStatusAlertButton = statusAlert.find('button').filterWhere(button => button.matchesElement(<button><span>&times;</span></button>));


      // const deleteAsset = (assetsParameters, assetId) => {
      //   //this.props.assetsList.filter(asset => asset.id !== assetId);
      //   // this.props.assetsList.filter(asset => (asset.id !== assetId));
      //   wrapper.prop('assetsList').filter(asset => (asset.id !== assetId));
      // };

      // wrapper.setProps({ deleteAsset: () => { deleteAsset({}, 'cat.jpg')} });
      // wrapper.update();

      // console.log(trashButtons.at(0).html());

      // const callback = () => {
      //   console.log(wrapper.prop('assetsList'));
      //   wrapper.setProps({ assetsList: defaultProps.assetsList.filter(asset => asset.id !== 'cat.jpg') });
      //   wrapper.update();
      //   console.log(wrapper.prop('assetsList'));
      // };

      // const mockDeleteAsset = jest.fn()
      //   .mockImplementationOnce(
      //     this.props.assetList.filter(asset => asset.id !== this.state.assetToDelete.id),
      //   );

      console.log(wrapper.prop('assetsList'));

      trashButtons.at(0).simulate('click');

      // console.log(trashButtons.at(0).html());

      // wrapper.setProps({ assetsList: defaultProps.assetsList.filter(asset => asset.id !== 'cat.jpg') });
      console.log("I'm deleting an asset!");
      deleteButton.at(0).simulate('click');
      expect(mockDeleteAsset).toHaveBeenCalledTimes(1);
      console.log(wrapper.prop('assetsList'));
      wrapper.update();
      console.log(wrapper.prop('assetsList'));
      closeStatusAlertButton.at(0).simulate('click');

      console.log(wrapper.prop('assetsList'));


      // const deletedAssetId = defaultProps.assetsList[0].id;

      // wrapper.setProps({ assetsList: wrapper.prop('assetsList').filter(
      //   asset => asset.id !== deletedAssetId) },
      // );
      //how do I simulate new assetslist prop?
      // const newAssetsList = defaultProps.assetsList.slice().filter(asset => asset.id !== 'cat.jpg');
      // console.log(newAssetsList);
      // wrapper.setProps({ assetsList: newAssetsList });

      // trashButtons.forEach((button) =>
      //   console.log(button.html()));


      console.log(trashButtons.at(0).html());
      console.log(trashButtons.at(1).html());
      expect(trashButtons.at(0).matchesElement(document.activeElement)).toEqual(true);
      expect(trashButtons.at(1).matchesElement(document.activeElement)).toEqual(true);
      expect(nextFocusElement.matchesElement(document.activeElement)).toEqual(true);
    });
    it('moves to correct asset trashcan icon after nth asset deleted', () => {

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
