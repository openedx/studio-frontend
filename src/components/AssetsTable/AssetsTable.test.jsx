import React from 'react';
import { StatusAlert } from '@edx/paragon';

import AssetsTable from './index';

import { mountWithIntl } from '../../utils/i18n/enzymeHelper';
import { assetActions } from '../../data/constants/actionTypes';
import { assetLoading } from '../../data/constants/loadingTypes';
import courseDetails from '../../utils/testConstants';

const thumbnail = '/animal';
const copyUrl = 'animal';

const defaultProps = {
  assetsList: [
    {
      display_name: 'cat.jpg',
      id: 'cat.jpg',
      thumbnail,
      locked: false,
      portable_url: copyUrl,
      external_url: copyUrl,
    },
    {
      display_name: 'dog.png',
      id: 'dog.png',
      thumbnail,
      locked: true,
      portable_url: null,
      external_url: null,
    },
    {
      display_name: 'bird.json',
      id: 'bird.json',
      thumbnail: null,
      locked: false,
      portable_url: null,
      external_url: copyUrl,
    },
    {
      display_name: 'fish.doc',
      id: 'fish.doc',
      thumbnail: null,
      locked: false,
      portable_url: copyUrl,
      external_url: null,
    },
  ],
  assetsSortMetadata: {},
  assetsStatus: {},
  courseDetails,
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

const clearStatus = (wrapper) => {
  wrapper.setProps({ assetsStatus: {} });
};

const getMockForDeleteAsset = (wrapper, assetToDeleteId) => (
  jest.fn(() => {
    wrapper.setProps({
      assetsList: defaultProps.assetsList.filter(asset => asset.id !== assetToDeleteId),
      assetsStatus: { type: assetActions.delete.DELETE_ASSET_SUCCESS },
    });
  })
);

const getMockForTogglingLockAsset = (wrapper, assetToToggle) => (
  jest.fn(() => {
    wrapper.setProps({
      assetsList: defaultProps.assetsList.map((asset) => {
        if (asset.id === assetToToggle) {
          return { ...asset, loadingFields: [assetLoading.LOCK] };
        }
        return asset;
      }),
    });
  })
);

const numberOfImages = defaultProps.assetsList.filter(asset => asset.thumbnail).length;
const numberOfStudioButtons = defaultProps.assetsList.filter(asset => asset.portable_url).length;
const numberOfWebButtons = defaultProps.assetsList.filter(asset => asset.external_url).length;

let wrapper;

describe('<AssetsTable />', () => {
  describe('renders', () => {
    beforeEach(() => {
      wrapper = mountWithIntl(
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
        expect(row.containsMatchingElement(
          <td><span data-identifier="asset-file-name">{defaultProps.assetsList[index].display_name}</span></td>,
        ))
          .toEqual(true);

        const rowThumbnail = defaultProps.assetsList[index].thumbnail;

        if (rowThumbnail) {
          expect(row.find(`img[src="${baseUrl}${rowThumbnail}"][alt="Description not available"]`)).toHaveLength(1);
        } else {
          expect(row.find('.no-image-preview')).toHaveLength(1);
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
    it('empty table on API Error', () => {
      wrapper.setProps({
        assetsStatus: {
          response: {},
          type: assetActions.delete.DELETE_ASSET_FAILURE,
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
          ...defaultProps.assetsSortMetadata,
          ...sortProps,
        };

        wrapper = mountWithIntl(
          <AssetsTable
            {...defaultProps}
            updateSort={updateSortSpy}
            assetsSortMetadata={sortableAssetParameters}
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
          defaultProps.courseDetails,
        );
      });
    });
  });
  describe('copy buttons', () => {
    beforeEach(() => {
      wrapper = mountWithIntl(
        <AssetsTable
          {...defaultProps}
        />,
      );
    });
    it('onCopyButton click changes copyButtonIsClicked state', () => {
      expect(wrapper.state('copyButtonIsClicked')).toEqual(false);

      const copyButtons = wrapper.find('tr td CopyButton');
      copyButtons.at(0).simulate('click');

      expect(wrapper.state('copyButtonIsClicked')).toEqual(true);
    });
  });
  describe('modal', () => {
    let modal;

    beforeEach(() => {
      wrapper = mountWithIntl(
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

      const closeButton = modal.find('button').filterWhere(button => button.text() === 'Cancel');
      expect(closeButton).toHaveLength(1);

      closeButton.simulate('click');

      expect(wrapper.state('modalOpen')).toEqual(false);
    });
  });
  describe('deleteAsset', () => {
    it('calls deleteAsset function prop correctly', () => {
      const deleteAssetSpy = jest.fn();

      wrapper = mountWithIntl(
        <AssetsTable
          {...defaultProps}
          deleteAsset={deleteAssetSpy}
        />,
      );

      const trashButtons = wrapper.find('button').filterWhere(button => button.hasClass('fa-trash'));
      const deleteButton = wrapper.find('[role="dialog"] button').filterWhere(button => button.hasClass('btn-primary') && button.text() === 'Permanently delete');

      trashButtons.at(0).simulate('click');
      deleteButton.simulate('click');

      expect(deleteAssetSpy).toHaveBeenCalledTimes(1);
      expect(deleteAssetSpy).toHaveBeenCalledWith(
        defaultProps.assetsList[0].id,
        defaultProps.courseDetails,
      );
    });
    it('closes on deleteAsset call', () => {
      wrapper = mountWithIntl(
        <AssetsTable
          {...defaultProps}
        />,
      );

      const trashButtons = wrapper.find('button').filterWhere(button => button.hasClass('fa-trash'));
      const deleteButton = wrapper.find('[role="dialog"] button').filterWhere(button => button.hasClass('btn-primary') && button.text() === 'Permanently delete');

      trashButtons.at(0).simulate('click');
      deleteButton.simulate('click');

      expect(wrapper.find('[role="dialog"]').hasClass('modal-open')).toEqual(false);
      expect(wrapper.state('modalOpen')).toEqual(false);
    });
  });
  describe('onDeleteClick', () => {
    let trashButtons;

    beforeEach(() => {
      wrapper = mountWithIntl(
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
      wrapper = mountWithIntl(
        <AssetsTable
          {...defaultProps}
        />,
      );

      trashButtons = wrapper.find('button').filterWhere(button => button.hasClass('fa-trash'));

      modal = wrapper.find('[role="dialog"]');
      closeButton = modal.find('button').filterWhere(button => button.text() === '×');
    });

    it('moves from modal to trashcan on modal close', () => {
      trashButtons.at(0).simulate('click');

      expect(closeButton.html()).toEqual(document.activeElement.outerHTML);

      closeButton.simulate('click');

      expect(trashButtons.at(0).html()).toEqual(document.activeElement.outerHTML);
    });

    it('moves from modal to status alert on asset delete', () => {
      const deleteButton = wrapper.find('[role="dialog"] button').filterWhere(button => button.hasClass('btn-primary') && button.text() === 'Permanently delete');
      trashButtons.at(0).simulate('click');
      expect(closeButton.html()).toEqual(document.activeElement.outerHTML);

      mockDeleteAsset = getMockForDeleteAsset(wrapper, 0);
      wrapper.setProps({ deleteAsset: mockDeleteAsset });
      deleteButton.simulate('click');
      const statusAlert = wrapper.find(StatusAlert);
      const closeStatusAlertButton = statusAlert.find('button').filterWhere(button => button.text() === '×');
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

        const deleteButton = wrapper.find('[role="dialog"] button').filterWhere(button => button.hasClass('btn-primary') && button.text() === 'Permanently delete');

        trashButtons.at(test.trashButtonIndex).simulate('click');

        deleteButton.simulate('click');
        expect(mockDeleteAsset).toHaveBeenCalledTimes(1);

        const statusAlert = wrapper.find(StatusAlert);
        const closeStatusAlertButton = statusAlert.find('button').filterWhere(button => button.text() === '×');
        wrapper.setProps({
          clearAssetsStatus: () => clearStatus(wrapper),
        });
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
  describe('status alert', () => {
    describe('renders', () => {
      const assetsStatuses = [
        assetActions.clear.CLEAR_FILTERS_FAILURE,
        assetActions.filter.FILTER_UPDATE_FAILURE,
        assetActions.paginate.PAGE_UPDATE_FAILURE,
        assetActions.sort.SORT_UPDATE_FAILURE,
      ];

      beforeEach(() => {
        wrapper = mountWithIntl(
          <AssetsTable
            {...defaultProps}
          />,
        );
      });

      assetsStatuses.forEach((statusType) => {
        it(`on ${statusType}`, () => {
          const assetsStatus = {
            type: statusType,
          };

          wrapper.setProps({
            assetsStatus,
          });

          const statusAlert = wrapper.find(StatusAlert);
          expect(statusAlert.prop('alertType')).toEqual('danger');
          expect(statusAlert.find('.alert-dialog').text()).toEqual('The action could not be completed. Refresh the page, and then try the action again.');
        });
      });
    });
  });
});

describe('Lock asset', () => {
  const getLockedButtons = () => wrapper.find('button .fa-lock');
  const getUnlockedButtons = () => wrapper.find('button .fa-unlock');
  const getLockingButtons = () => wrapper.find('button > .fa-spinner');
  beforeEach(() => {
    wrapper = mountWithIntl(
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
        type: assetActions.lock.TOGGLING_LOCK_ASSET_FAILURE,
        asset: { name: 'marmoset.png' },
      },
    });
    const statusAlert = wrapper.find(StatusAlert);
    expect(statusAlert.prop('alertType')).toEqual('danger');
    expect(statusAlert.find('.alert-dialog').text()).toEqual('Failed to toggle lock for marmoset.png.');
  });
});

describe('displays status alert properly', () => {
  it('renders success alert on success', () => {
    wrapper = mountWithIntl(
      <AssetsTable
        {...defaultProps}
      />,
    );

    wrapper.setProps({
      assetsStatus: {
        response: {},
        type: assetActions.delete.DELETE_ASSET_SUCCESS,
      },
    });
    const statusAlert = wrapper.find(StatusAlert);
    const statusAlertType = statusAlert.prop('alertType');

    expect(statusAlertType).toEqual('success');
    expect(statusAlert.find('div').first().hasClass('alert-success')).toEqual(true);
  });

  it('renders danger alert on error', () => {
    wrapper = mountWithIntl(
      <AssetsTable
        {...defaultProps}
      />,
    );

    wrapper.setProps({
      assetsStatus: {
        response: {},
        type: assetActions.delete.DELETE_ASSET_FAILURE,
      },
    });
    const statusAlert = wrapper.find(StatusAlert);
    const statusAlertType = statusAlert.prop('alertType');

    expect(statusAlertType).toEqual('danger');
    expect(statusAlert.find('div').first().hasClass('alert-danger')).toEqual(true);
  });

  it('hides the alert when state cleared', () => {
    wrapper = mountWithIntl(
      <AssetsTable
        {...defaultProps}
      />,
    );
    let statusAlert = wrapper.find(StatusAlert);

    statusAlert = wrapper.find(StatusAlert);
    expect(statusAlert).toBeDefined();

    wrapper.setState({ assetsStatus: {} });
    statusAlert = wrapper.find(StatusAlert);
    expect(statusAlert.find('.alert-dialog').text()).toEqual('');
  });

  it('clears uploading assets on keyDown', () => {
    wrapper = mountWithIntl(
      <AssetsTable
        {...defaultProps}
      />,
    );
    wrapper.setProps({
      clearAssetsStatus: () => clearStatus(wrapper),
    });
    wrapper.setProps({ assetsStatus: { type: assetActions.upload.UPLOADING_ASSETS, count: 77 } });

    let statusAlert = wrapper.find(StatusAlert);
    expect(statusAlert.find('.alert-dialog').text()).toEqual('77 files uploading.');

    statusAlert.find('button').at(0).simulate('keyDown', { key: 'Enter' });
    expect(wrapper.props().assetsStatus).toEqual({});

    statusAlert = wrapper.find(StatusAlert);
    expect(statusAlert.find('.alert-dialog').text()).toEqual('');
  });
});

describe('Upload statuses', () => {
  beforeEach(() => {
    wrapper = mountWithIntl(
      <AssetsTable
        {...defaultProps}
      />,
    );
  });

  it('renders uploading', () => {
    wrapper.setProps({
      assetsStatus: {
        type: assetActions.upload.UPLOADING_ASSETS,
        count: 885,
      },
    });
    const statusAlert = wrapper.find(StatusAlert);
    expect(statusAlert.find('.alert-dialog').text()).toEqual('885 files uploading.');
  });

  it('renders upload success', () => {
    wrapper.setState({ uploadSuccessCount: 5 });
    wrapper.setProps({
      assetsStatus: {
        type: assetActions.upload.UPLOAD_ASSET_SUCCESS,
      },
    });

    const statusAlert = wrapper.find(StatusAlert);
    expect(statusAlert.find('.alert-dialog').text()).toEqual('5 files successfully uploaded.');
  });

  it('renders upload success', () => {
    wrapper.setProps({
      assetsStatus: {
        type: assetActions.upload.UPLOAD_EXCEED_MAX_COUNT_ERROR,
        maxFileCount: 110,
      },
    });
    const statusAlert = wrapper.find(StatusAlert);
    expect(statusAlert.find('.alert-dialog').text()).toEqual('The maximum number of files for an upload is 110. No files were uploaded.');
  });

  it('renders upload exceeds maximum file count', () => {
    wrapper.setProps({
      assetsStatus: {
        type: assetActions.upload.UPLOAD_EXCEED_MAX_COUNT_ERROR,
        maxFileCount: 110,
      },
    });
    const statusAlert = wrapper.find(StatusAlert);
    expect(statusAlert.find('.alert-dialog').text()).toEqual('The maximum number of files for an upload is 110. No files were uploaded.');
  });

  it('renders upload exceeds maximum file size', () => {
    wrapper.setProps({
      assetsStatus: {
        type: assetActions.upload.UPLOAD_EXCEED_MAX_SIZE_ERROR,
        maxFileSizeMB: 9,
      },
    });
    const statusAlert = wrapper.find(StatusAlert);
    expect(statusAlert.find('.alert-dialog').text()).toEqual('The maximum size for an upload is 9 MB. No files were uploaded.');
  });

  it('renders upload failed', () => {
    wrapper.setProps({
      assetsStatus: {
        type: assetActions.upload.UPLOAD_ASSET_FAILURE,
        file: { name: 'quail.png' },
      },
    });
    const statusAlert = wrapper.find(StatusAlert);
    expect(statusAlert.find('.alert-dialog').text()).toEqual('Error uploading quail.png. Try again.');
  });
});
