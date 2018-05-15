import React from 'react';

import AssetsTable from './index';
import { courseDetails, testAssetsList } from '../../utils/testConstants';
import { assetActions } from '../../data/constants/actionTypes';
import { assetLoading } from '../../data/constants/loadingTypes';
import mockQuerySelector from '../../utils/mockQuerySelector';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';
import AssetsStatusAlert from '../AssetsStatusAlert/index';

const getStatusAlert = () => (
  <AssetsStatusAlert
    clearAssetsStatus={() => {}}
    onDeleteStatusAlertClose={() => {}}
  />);

const defaultProps = {
  assetsList: testAssetsList,
  assetsSortMetadata: {},
  assetsStatus: {},
  assetToDelete: {},
  courseDetails,
  courseFilesDocs: 'testUrl',
  isImagePreviewEnabled: true,
  clearAssetsStatus: () => {},
  deleteAsset: () => {},
  stageAssetDeletion: () => {},
  statusAlertRef: getStatusAlert(),
  toggleLockAsset: () => {},
  unstageAssetDeletion: () => {},
  updateSort: () => {},
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
  beforeEach(() => {
    mockQuerySelector.init();
  });
  afterEach(() => {
    mockQuerySelector.reset();
  });
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
    it('correct number of hidden of headings', () => {
      // non-sortable, non-hidden columns (e.g. Copy URLs) will not have a sortable button
      // but will have screenreader only text still within the header, validate that it is there
      expect(
        wrapper.find('th').filterWhere(heading => heading.childAt(0).exists() &&
          !heading.childAt(0).html().includes('button') &&
          heading.childAt(0).html().includes('<span class="sr-only">')),
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
      expect(modal.hasClass('show')).toEqual(true);
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
    it('calls unstageAssetDeletion when Cancel button clicked', () => {
      const unstageAssetDeletionSpy = jest.fn();

      wrapper.setProps({
        unstageAssetDeletion: unstageAssetDeletionSpy,
      });

      const trashButtons = wrapper.find('button').filterWhere(button => button.hasClass('fa-trash'));
      trashButtons.at(0).simulate('click');

      const closeButton = modal.find('button').filterWhere(button => button.text() === 'Cancel');
      closeButton.simulate('click');

      expect(unstageAssetDeletionSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('deleteAsset', () => {
    it('calls deleteAsset function prop correctly', () => {
      const deleteAssetSpy = jest.fn();

      wrapper = mountWithIntl(
        <AssetsTable
          {...defaultProps}
          deleteAsset={deleteAssetSpy}
          assetToDelete={defaultProps.assetsList[0]}
        />,
      );

      const trashButtons = wrapper.find('button').filterWhere(button => button.hasClass('fa-trash'));
      const deleteButton = wrapper.find('[role="dialog"] button').filterWhere(button => button.hasClass('btn-primary') && button.text() === 'Permanently delete');

      trashButtons.at(0).simulate('click');
      deleteButton.simulate('click');

      expect(deleteAssetSpy).toHaveBeenCalledTimes(1);
      expect(deleteAssetSpy).toHaveBeenCalledWith(
        defaultProps.assetsList[0],
        defaultProps.courseDetails,
      );
    });
    it('closes modal on deleteAsset call', () => {
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
    it('calls stageAssetDeletion prop', () => {
      const stageAssetDeletionSpy = jest.fn();

      wrapper.setProps({
        stageAssetDeletion: stageAssetDeletionSpy,
      });

      trashButtons.at(0).simulate('click');

      expect(stageAssetDeletionSpy).toHaveBeenCalledTimes(1);
      expect(stageAssetDeletionSpy).toHaveBeenCalledWith(defaultProps.assetsList[0], 0);
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

    beforeEach(() => {
      wrapper = mountWithIntl(
        <AssetsTable
          {...defaultProps}
        />,
      );

      trashButtons = wrapper.find('button').filterWhere(button => button.hasClass('fa-trash'));

      modal = wrapper.find('[role="dialog"]');
      closeButton = modal.find('button').filterWhere(button => button.hasClass('p-1'));
    });

    it('moves from modal to trashcan on modal close', () => {
      trashButtons.at(0).simulate('click');

      expect(closeButton.html()).toEqual(document.activeElement.outerHTML);

      closeButton.simulate('click');

      expect(trashButtons.at(0).html()).toEqual(document.activeElement.outerHTML);
    });
  });
  describe('image previews', () => {
    beforeEach(() => {
      wrapper = mountWithIntl(
        <AssetsTable
          {...defaultProps}
        />,
      );
    });

    test('show by default', () => {
      expect(wrapper.find('[data-identifier="asset-image-thumbnail"]')).toHaveLength(wrapper.prop('assetsList').length);
    });

    test('do not show when isImagePreviewEnabled is false', () => {
      wrapper.setProps({
        isImagePreviewEnabled: false,
      });

      expect(wrapper.find('[data-identifier="asset-image-thumbnail"]')).toHaveLength(0);
    });
  });
});

describe('Lock Asset', () => {
  const getLockedButtons = () => wrapper.find('button .fa-lock');
  const getUnlockedButtons = () => wrapper.find('button .fa-unlock');
  const getLockingButtons = () => wrapper.find('button > .fa-spinner');

  beforeEach(() => {
    mockQuerySelector.init();

    wrapper = mountWithIntl(
      <AssetsTable
        {...defaultProps}
      />,
    );
  });

  afterEach(() => {
    mockQuerySelector.reset();
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
});
