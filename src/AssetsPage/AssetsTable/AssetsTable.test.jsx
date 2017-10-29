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
  deleteAsset: () => {},
  updateSort: () => {},
  clearAssetsStatus: () => {},
};

let wrapper;

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

    const params = [
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

    params.forEach((sortableAssetsValues, index) => {
      it(`calls onSort function appropriately for ${sortableAssetsValues.direction} click`, () => {
        const sortableAssetsParameters = {
          ...defaultProps.assetsParameters,
          ...sortableAssetsValues,
        };

        const testValues = assertValues[index];

        wrapper = mount(
          <AssetsTable
            {...defaultProps}
            updateSort={updateSortSpy}
            assetsParameters={sortableAssetsParameters}
          />,
        );

        const sortButtons = wrapper.find('button').filterWhere(button =>
          (button.find('span > span .fa-sort').exists() ||
          button.find('span > span .fa-sort-desc').exists() ||
          button.find('span > span .fa-sort-asc').exists()));

        expect(sortButtons).toHaveLength(3);
        // console.log(testValues.buttonIndexToClick);
        // console.log(testValues.buttonToClickText);
        // console.log(sortButtons.at(testValues.buttonIndexToClick).html());

        expect(sortButtons.at(testValues.buttonIndexToClick).filterWhere(button =>
          (button.text().includes(testValues.buttonToClickText)))).toHaveLength(1);

        sortButtons.at(testValues.buttonIndexToClick).simulate('click');

        expect(updateSortSpy).toHaveBeenCalledTimes(1);
        expect(updateSortSpy).toHaveBeenLastCalledWith(testValues.onSortColumnParameter,
          testValues.onSortDirectionParameter);
      });
    });

    // it('calls onSort function appropriately for ascending click', () => {
    //   const sortableAssetsParameters = {
    //     ...defaultProps.assetsParameters,
    //     sort: 'date_added',
    //     direction: 'desc',
    //   };

    //   wrapper = mount(
    //     <AssetsTable
    //       {...defaultProps}
    //       updateSort={updateSortSpy}
    //       assetsParameters={sortableAssetsParameters}
    //     />,
    //   );

    //   const sortButtons = wrapper.find('button').filterWhere(button =>
    // (button.find('span > span .fa-sort').exists() ||
    // button.find('span > span .fa-sort-desc').exists() ||
    // button.find('span > span .fa-sort-asc').exists()));
    //   expect(sortButtons).toHaveLength(3);

    //   sortButtons.at(2).simulate('click');

    //   expect(updateSortSpy).toHaveBeenCalledTimes(1);
    //   expect(updateSortSpy).toHaveBeenLastCalledWith('date_added', 'asc');
    // });
    // it('onSortClick calls onSort function appropriately for descending click', () => {
    //   const sortableAssetsParameters = {
    //     ...defaultProps.assetsParameters,
    //     sort: 'date_added',
    //     direction: 'asc',
    //   };

    //   wrapper = mount(
    //     <AssetsTable
    //       {...defaultProps}
    //       updateSort={updateSortSpy}
    //       assetsParameters={sortableAssetsParameters}
    //     />,
    //   );

    //   const sortButtons = wrapper.find('button').filterWhere(button =>
    // (button.find('span > span .fa-sort').exists() ||
    // button.find('span > span .fa-sort-desc').exists()
    // || button.find('span > span .fa-sort-asc').exists()));
    //   expect(sortButtons).toHaveLength(3);

    //   expect(sortButtons.at(2).filterWhere(button =>
    // (button.text().includes('Date Added')))).toHaveLength(1);

    //   sortButtons.at(2).simulate('click');

    //   expect(updateSortSpy).toHaveBeenCalledTimes(1);
    //   expect(updateSortSpy).toHaveBeenLastCalledWith('date_added', 'desc');
    // });
    // it('onSortClick calls onSort function appropriately for descending
    // click on different column', () => {
    //   const sortableAssetsParameters = {
    //     ...defaultProps.assetsParameters,
    //     sort: 'date_added',
    //     direction: 'desc',
    //   };

    //   wrapper = mount(
    //     <AssetsTable
    //       {...defaultProps}
    //       updateSort={updateSortSpy}
    //       assetsParameters={sortableAssetsParameters}
    //     />,
    //   );

    //   const sortButtons = wrapper.find('button').filterWhere(button =>
    // (button.find('span > span .fa-sort').exists() ||
    // button.find('span > span .fa-sort-desc').exists() ||
    // button.find('span > span .fa-sort-asc').exists()));
    //   expect(sortButtons).toHaveLength(3);

    //   sortButtons.at(0).simulate('click');

    //   expect(updateSortSpy).toHaveBeenCalledTimes(1);
    //   expect(updateSortSpy).toHaveBeenLastCalledWith('display_name', 'desc');
    // });
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
      // expect(modal).toHaveLength(1);

      // const deleteButtons = modal.find('button');
      // expect(deleteButtons).toHaveLength(3);

      // const deleteButton = deleteButtons.filterWhere(button => (button.props('display')));
      // const deleteButton = deleteButtons.filterWhere(button =>
      // button.matchesElement(<button>Yes, delete.</button>));

      // expect(deleteButton).toHaveLength(1);
      // console.log(deleteButton.at(0).html());

      expect(modal.hasClass('modal-open')).toEqual(false);
      expect(wrapper.state('modalOpen')).toEqual(false);
    });
    it('opens when trash button clicked', () => {
      wrapper = mount(
        <AssetsTable
          {...defaultProps}
        />,
      );

      const modal = wrapper.find('[role="dialog"]');
      expect(modal).toHaveLength(1);

      const buttons = wrapper.find('button');
      // expect(deleteButtons).toHaveLength(3);

      // const deleteButton = deleteButtons.filterWhere(button =>
      // button.matchesElement(<button>Yes, delete.</button>));
      const trashButtons = buttons.filterWhere(button => button.hasClass('fa-trash'));

      expect(trashButtons).toHaveLength(3);

      trashButtons.at(0).simulate('click');

      expect(modal.hasClass('modal-open')).toEqual(true);
      expect(wrapper.state('modalOpen')).toEqual(true);
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
      expect(deleteAssetSpy).toHaveBeenCalledWith(defaultProps.assetsParameters,
        defaultProps.assetsList[0].id);

      // this.props.assetsParameters, this.state.assetToDelete.id
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
    // it('sets modalOpen state to false on close', () => {
    //   wrapper = mount(
    //     <AssetsTable
    //       {...defaultProps}
    //     />,
    //   );

    //   wrapper.setState({ modalOpen: true });

    //   const modal = wrapper.find('[role="dialog"]');
    //   const closeButton = modal.find('button').filterWhere(
    // button => button.matchesElement(<button>Cancel</button>));
    //   expect(closeButton).toHaveLength(1);

    //   closeButton.at(0).simulate('click');

    //   expect(wrapper.state('modalOpen')).toEqual(false);

    //   // filterWhere(button => button.matchesElement(<button>Yes, delete.</button>));
    // });
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
    it('moves from modal to trashcan on modal close', () => {
      wrapper = mount(
        <AssetsTable
          {...defaultProps}
        />,
      );

      const deleteButtons = wrapper.find('button');
      const trashButtons = deleteButtons.filterWhere(button => button.hasClass('fa-trash'));

      const modal = wrapper.find('[role="dialog"]');
      const closeButton = modal.find('button').filterWhere(button => button.matchesElement(<button>Cancel</button>));

      trashButtons.at(0).simulate('click');
      closeButton.at(0).simulate('click');

      // console.log(wrapper.state('elementToFocusOnModalClose'));

      expect(trashButtons.at(0).matchesElement(document.activeElement)).toEqual(true);
      expect(trashButtons.at(0).matchesElement(document.activeElement)).toEqual(true);
    });
    it('moves from trashcan button to modal on trashcan button click', () => {

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
