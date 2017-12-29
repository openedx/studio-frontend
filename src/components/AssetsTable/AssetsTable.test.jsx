import React from 'react';
import Enzyme from 'enzyme';
import { AssetsTable } from './index';

import { assetActions } from '../../data/constants/actionTypes';
import { assetLoading } from '../../data/constants/loadingTypes';

const { mount } = Enzyme;

const thumbnail = '/animal';
const copyUrl = 'animal';

const defaultProps = {
  assetsList: [
    {
      display_name: 'cat.jpg',
      id: 'cat.jpg',
      thumbnail,
      locked: false,
      url: copyUrl,
      external_url: copyUrl,
    },
    {
      display_name: 'dog.png',
      id: 'dog.png',
      thumbnail,
      locked: true,
      url: null,
      external_url: null,
    },
    {
      display_name: 'bird.json',
      id: 'bird.json',
      thumbnail: null,
      locked: false,
      url: null,
      external_url: copyUrl,
    },
    {
      display_name: 'fish.doc',
      id: 'fish.doc',
      thumbnail: null,
      locked: false,
      url: copyUrl,
      external_url: null,
    },
  ],
  assetsSortMetaData: {},
  assetsStatus: {},
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
  courseFilesDocs: 'testUrl',
  clearAssetsStatus: () => {},
  deleteAsset: () => {},
  updateSort: () => {},
  toggleLockAsset: () => {},
};

const defaultColumns = [
  {
    label: 'Image Preview',
    columnSortable: false,
    hideHeader: true,
  },
  {
    label: 'Name',
    columnSortable: true,
  },
  {
    label: 'Type',
    columnSortable: true,
  },
  {
    label: 'Date Added',
    columnSortable: true,
  },
  {
    label: 'Copy URLs',
    columnSortable: false,
  },
  {
    label: 'Delete Asset',
    columnSortable: false,
    hideHeader: true,
  },
  {
    label: 'Lock Asset',
    columnSortable: false,
    hideHeader: true,
  },
];

const setDeletedAsset = (asset, wrapper) => {
  wrapper.setState({ deletedAsset: asset });
};

const clearStatus = (wrapper) => {
  wrapper.setProps({ assetsStatus: {} });
};

const getMockForDeleteAsset = (wrapper, assetToDeleteId) => (
  jest.fn(() => {
    wrapper.setProps({ assetsList: defaultProps.assetsList.filter(asset => asset.id !== assetToDeleteId), assetsStatus: { type: 'DELETE_ASSET_SUCCESS' } });
  })
);

const getMockForTogglingLockAsset = (wrapper, assetToToggle) => (
  jest.fn(() => {
    wrapper.setProps({ assetsList: defaultProps.assetsList.map((asset) => {
      if (asset.id === assetToToggle) {
        return { ...asset, loadingFields: [assetLoading.LOCK] };
      }
      return asset;
    }) });
  })
);

const numberOfImages = defaultProps.assetsList.filter(asset => asset.thumbnail).length;
const numberOfStudioButtons = defaultProps.assetsList.filter(asset => asset.url).length;
const numberOfWebButtons = defaultProps.assetsList.filter(asset => asset.external_url).length;

let wrapper;

describe('<AssetsTable />', () => {
  describe('renders', () => {
    beforeEach(() => {
      wrapper = mount(
        <AssetsTable
          {...defaultProps}
        />,
      );
    });
    it('correct number of assets', () => {
      // + 1 because it includes row item for headings
      expect(wrapper.find('tr')).toHaveLength(defaultProps.assetsList.length + 1);
    });
    it('with responsive class', () => {
      expect(wrapper.find('table').hasClass('table-responsive')).toEqual(true);
    });
    it('correct number of headings', () => {
      expect(wrapper.find('th')).toHaveLength(defaultColumns.length);
    });
    it('correct sortable status of headings', () => {
      expect(
        wrapper.find('th').filterWhere(heading => heading.hasClass('sortable')),
      ).toHaveLength(
        defaultColumns.filter(column => column.columnSortable).length,
      );
    });
    it('correct hidden status of headings', () => {
      // non-sortable, non-hidden columns (e.g. Copy URLs) may just have text in the heading,
      // in which case they have no children, so we have an explicit check that the heading
      // has a child
      expect(
        wrapper.find('th').filterWhere(heading => heading.childAt(0).exists() && heading.childAt(0).html() === '<span class="sr-only"></span>'),
      ).toHaveLength(
        defaultColumns.filter(column => column.hideHeader).length,
      );
    });
    it('correct number of trashcan buttons', () => {
      expect(wrapper.find('tr button').filterWhere(button => button.hasClass('fa-trash'))).toHaveLength(defaultProps.assetsList.length);
    });
    it('correct number of images', () => {
      const images = wrapper.find('tr img');
      expect(images).toHaveLength(numberOfImages);
    });
    it('correct type of images', () => {
      const rows = wrapper.find('tr').filterWhere(row => row.find('td').exists());

      expect(wrapper.find('td img')).toHaveLength(numberOfImages);

      const baseUrl = defaultProps.courseDetails.base_url;

      rows.forEach((row, index) => {
        expect(row.containsMatchingElement(<td>{defaultProps.assetsList[index].display_name}</td>))
          .toEqual(true);

        const rowThumbnail = defaultProps.assetsList[index].thumbnail;

        if (rowThumbnail) {
          expect(row.find(`img[src="${baseUrl}${rowThumbnail}"][alt="Description not available"]`)).toHaveLength(1);
        } else {
          expect(row.containsMatchingElement(<td>Preview not available</td>)).toEqual(true);
        }
      });
    });
    it('correct number of copy buttons', () => {
      expect(wrapper.find('tr td CopyButton')).toHaveLength(numberOfStudioButtons + numberOfWebButtons);
    });
    it('correct number of Studio copy buttons', () => {
      expect(wrapper.find('tr td CopyButton')
        .filterWhere(copyButton => copyButton.text().trim() === 'Studio'))
        .toHaveLength(numberOfStudioButtons);
    });
    it('correct number of Web copy buttons', () => {
      expect(wrapper.find('tr td CopyButton')
        .filterWhere(copyButton => copyButton.text().trim() === 'Web'))
        .toHaveLength(numberOfWebButtons);
    });
    it('Loading when waiting for response', () => {
      const emptyProps = {
        assetsList: [],
        assetsSortMetaData: {},
        assetsStatus: {},
        courseDetails: {},
        courseFilesDocs: '',
        deleteAsset: () => {},
        clearAssetsStatus: () => {},
        updateSort: () => {},
        toggleLockAsset: () => {},
      };
      wrapper = mount(
        <AssetsTable
          {...emptyProps}
        />,
      );
      expect(wrapper.html()).toEqual('<span>Loading....</span>');
    });
    it('empty table on API Error', () => {
      wrapper.setProps({
        assetsStatus: {
          response: {},
          type: assetActions.DELETE_ASSET_FAILURE,
        },
        assetsList: [],
      });
      // Table heading only
      expect(wrapper.find('tr')).toHaveLength(1);
    });
  });
  describe('onSortClick', () => {
    let updateSortSpy;

    beforeEach(() => {
      updateSortSpy = jest.fn();
    });

    const testData = [
      {
        sortProps: {
          sort: 'date_added',
          direction: 'desc',
        },
        expectedValues: {
          buttonIndexToClick: 2,
          buttonToClickText: 'Date Added',
          onSortColumnParameter: 'date_added',
          onSortDirectionParameter: 'asc',
        },
      },
      {
        sortProps: {
          sort: 'date_added',
          direction: 'asc',
        },
        expectedValues: {
          buttonIndexToClick: 2,
          buttonToClickText: 'Date Added',
          onSortColumnParameter: 'date_added',
          onSortDirectionParameter: 'desc',
        },
      },
      {
        sortProps: {
          sort: 'date_added',
          direction: 'desc',
        },
        expectedValues: {
          buttonIndexToClick: 0,
          buttonToClickText: 'Name',
          onSortColumnParameter: 'display_name',
          onSortDirectionParameter: 'desc',
        },
      },
    ];

    testData.forEach((test) => {
      const sortProps = test.sortProps;
      const expectedValues = test.expectedValues;

      it(`calls onSort function with ${sortProps.direction} click on ${sortProps.sort === 'date_added' ? 'same' : 'different'} column`, () => {
        const sortableAssetParameters = {
          ...defaultProps.assetsSortMetaData,
          ...sortProps,
        };

        wrapper = mount(
          <AssetsTable
            {...defaultProps}
            updateSort={updateSortSpy}
            assetsSortMetaData={sortableAssetParameters}
          />,
        );

        const sortButtons = wrapper.find('button').filterWhere(button => (
          button.find('span > span .fa-sort').exists() ||
          button.find('span > span .fa-sort-desc').exists() ||
          button.find('span > span .fa-sort-asc').exists()
        ));

        expect(sortButtons).toHaveLength(3);

        expect(sortButtons.at(expectedValues.buttonIndexToClick).filterWhere(button => (
          button.text().includes(expectedValues.buttonToClickText)
        ))).toHaveLength(1);

        sortButtons.at(expectedValues.buttonIndexToClick).simulate('click');

        expect(updateSortSpy).toHaveBeenCalledTimes(1);
        expect(updateSortSpy).toHaveBeenLastCalledWith(
          expectedValues.onSortColumnParameter,
          expectedValues.onSortDirectionParameter,
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
      trashButtons.at(0).simulate('click');

      modal = wrapper.find('[role="dialog"]');
      expect(modal.hasClass('modal-open')).toEqual(true);
      expect(wrapper.state('modalOpen')).toEqual(true);
    });
    it('closes when Cancel button clicked; modalOpen state is false', () => {
      const trashButtons = wrapper.find('button').filterWhere(button => button.hasClass('fa-trash'));
      trashButtons.at(0).simulate('click');

      const closeButton = modal.find('button').filterWhere(
        button => button.matchesElement(<button>Cancel</button>));
      expect(closeButton).toHaveLength(1);

      closeButton.simulate('click');

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

      const trashButtons = wrapper.find('button').filterWhere(button => button.hasClass('fa-trash'));
      const deleteButton = wrapper.find('[role="dialog"] button').filterWhere(button => button.hasClass('btn-primary') && button.matchesElement(<button>Permanently delete</button>));

      trashButtons.at(0).simulate('click');
      deleteButton.simulate('click');

      expect(deleteAssetSpy).toHaveBeenCalledTimes(1);
      expect(deleteAssetSpy).toHaveBeenCalledWith(
        defaultProps.assetsList[0].id,
        defaultProps.courseDetails,
      );
    });
    it('closes on deleteAsset call', () => {
      wrapper = mount(
        <AssetsTable
          {...defaultProps}
        />,
      );

      const trashButtons = wrapper.find('button').filterWhere(button => button.hasClass('fa-trash'));
      const deleteButton = wrapper.find('[role="dialog"] button').filterWhere(button => button.hasClass('btn-primary') && button.matchesElement(<button>Permanently delete</button>));

      trashButtons.at(0).simulate('click');
      deleteButton.simulate('click');

      expect(wrapper.find('[role="dialog"]').hasClass('modal-open')).toEqual(false);
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

      expect(trashButtons.at(0).html()).toEqual(wrapper.state('elementToFocusOnModalClose').outerHTML);
    });
  });
  describe('focus', () => {
    let closeButton;
    let modal;
    let trashButtons;
    let mockDeleteAsset;

    beforeEach(() => {
      wrapper = mount(
        <AssetsTable
          {...defaultProps}
        />,
      );

      trashButtons = wrapper.find('button').filterWhere(button => button.hasClass('fa-trash'));

      modal = wrapper.find('[role="dialog"]');
      closeButton = modal.find('button').filterWhere(button => button.matchesElement(<button><span>&times;</span></button>));
    });

    it('moves from modal to trashcan on modal close', () => {
      trashButtons.at(0).simulate('click');

      expect(closeButton.html()).toEqual(document.activeElement.outerHTML);

      closeButton.simulate('click');

      expect(trashButtons.at(0).html()).toEqual(document.activeElement.outerHTML);
    });

    it('moves from modal to status alert on asset delete', () => {
      const deleteButton = wrapper.find('[role="dialog"] button').filterWhere(button => button.hasClass('btn-primary') && button.matchesElement(<button>Permanently delete</button>));

      const statusAlert = wrapper.find('StatusAlert');
      const closeStatusAlertButton = statusAlert.find('button').filterWhere(button => button.matchesElement(<button><span>&times;</span></button>));

      trashButtons.at(0).simulate('click');

      expect(closeButton.html()).toEqual(document.activeElement.outerHTML);

      deleteButton.simulate('click');

      expect(closeStatusAlertButton.html()).toEqual(document.activeElement.outerHTML);
    });

    const testData = [
      {
        assetToDeleteIndex: 0,
        trashButtonIndex: 0,
        newFocusIndex: 0,
      },
      {
        assetToDeleteIndex: 2,
        trashButtonIndex: 2,
        newFocusIndex: 1,
      },
    ];

    testData.forEach((test) => {
      it(`moves to correct asset trashcan icon after asset ${test.assetToDeleteIndex} deleted`, () => {
        const assetToDeleteId = defaultProps.assetsList[test.assetToDeleteIndex].id;

        mockDeleteAsset = getMockForDeleteAsset(wrapper, assetToDeleteId);

        wrapper.setProps({ deleteAsset: mockDeleteAsset });

        const deleteButton = wrapper.find('[role="dialog"] button').filterWhere(button => button.hasClass('btn-primary') && button.matchesElement(<button>Permanently delete</button>));

        const statusAlert = wrapper.find('StatusAlert');
        const closeStatusAlertButton = statusAlert.find('button').filterWhere(button => button.matchesElement(<button><span>&times;</span></button>));

        trashButtons.at(test.trashButtonIndex).simulate('click');

        deleteButton.simulate('click');
        expect(mockDeleteAsset).toHaveBeenCalledTimes(1);

        closeStatusAlertButton.simulate('click');

        expect(mockDeleteAsset).toHaveBeenCalledTimes(1);
        expect(mockDeleteAsset).toHaveBeenCalledWith(
          assetToDeleteId,
          defaultProps.courseDetails,
        );

        // This gets the new trashcans after the asset delete.
        trashButtons = wrapper.find('button').filterWhere(button => button.hasClass('fa-trash'));

        expect(trashButtons.at(test.newFocusIndex).html())
          .toEqual(document.activeElement.outerHTML);
      });
    });
  });
});

describe('Lock asset', () => {
  const getLockedButtons = () => wrapper.find('button > .fa-lock');
  const getUnlockedButtons = () => wrapper.find('button > .fa-unlock');
  const getLockingButtons = () => wrapper.find('button > .fa-spinner');
  beforeEach(() => {
    wrapper = mount(
      <AssetsTable
        {...defaultProps}
      />,
    );
  });
  it('renders icons and buttons', () => {
    const lockedButtons = getLockedButtons();
    expect(lockedButtons).toHaveLength(1);

    const unlockedButtons = getUnlockedButtons();
    expect(unlockedButtons).toHaveLength(3);
  });
  it('can toggle state', () => {
    const assetToToggle = 'dog.png';
    const mockToggle = getMockForTogglingLockAsset(wrapper, assetToToggle);
    const lockedButtons = getLockedButtons();
    wrapper.setProps({ toggleLockAsset: mockToggle });

    // initial state should be locked
    expect(lockedButtons).toHaveLength(1);

    // clicking will set the spinner
    lockedButtons.simulate('click');
    const lockingButtons = getLockingButtons();
    expect(mockToggle).toHaveBeenCalledTimes(1);
    expect(lockingButtons.at(0).hasClass('fa-spinner')).toEqual(true);

    // returning the new locked state w/o loading will update the button
    expect(getUnlockedButtons()).toHaveLength(3);
    wrapper.setProps({
      assetsList: defaultProps.assetsList.map((asset) => {
        if (asset.id === assetToToggle) {
          return {
            ...asset,
            loadingFields: [],
            locked: false,
          };
        }
        return asset;
      }),
    });
    expect(getUnlockedButtons()).toHaveLength(4);
    expect(getLockedButtons()).toHaveLength(0);
  });
  it('displays locking errors', () => {
    wrapper.setProps({
      assetsStatus: {
        response: {},
        type: assetActions.TOGGLING_LOCK_ASSET_FAILURE,
        asset: { name: 'marmoset.png' },
      },
    });
    const statusAlert = wrapper.find('StatusAlert');
    expect(statusAlert.prop('alertType')).toEqual('danger');
    expect(statusAlert.find('.alert-dialog').text()).toEqual('Failed to toggle lock for marmoset.png');
  });
});

describe('displays status alert properly', () => {
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
        type: assetActions.DELETE_ASSET_FAILURE,
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
    let statusAlert = wrapper.find('StatusAlert');

    wrapper.setState({ statusAlertOpen: true });
    statusAlert = wrapper.find('StatusAlert');
    expect(statusAlert.find('div').first().prop('hidden')).toEqual(false);
  });

  it('hides the alert on close', () => {
    wrapper = mount(
      <AssetsTable
        {...defaultProps}
      />,
    );
    let statusAlert = wrapper.find('StatusAlert');

    wrapper.setState({ statusAlertOpen: true });
    statusAlert = wrapper.find('StatusAlert');
    expect(statusAlert.find('div').first().prop('hidden')).toEqual(false);

    wrapper.setState({ statusAlertOpen: false });
    statusAlert = wrapper.find('StatusAlert');
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
    setDeletedAsset(wrapper.props().assetsList[0], wrapper);
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
    setDeletedAsset(wrapper.props().assetsList[0], wrapper);
    statusAlert.find('button').at(0).simulate('keyDown', { key: 'Enter' });
    expect(wrapper.props().assetsStatus).toEqual({});
  });

  it('displays processing message for asset delete', () => {
    wrapper = mount(
      <AssetsTable
        {...defaultProps}
      />,
    );
    const statusAlertDialog = wrapper.find('.alert-dialog');
    const fileName = 'testFile';

    setDeletedAsset({ display_name: fileName }, wrapper);
    expect(statusAlertDialog.text()).toContain('Processing');
  });
});
