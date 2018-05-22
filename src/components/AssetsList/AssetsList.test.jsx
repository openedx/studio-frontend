import React from 'react';

import AssetsList from './index';
import { courseDetails, testAssetsList } from '../../utils/testConstants';
import messages from './displayMessages';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';
import { paginationInitial, selectInitial } from '../../data/reducers/assets';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';

const paginationMetadata = {
  ...paginationInitial,
  pageSize: 4,
};

const defaultProps = {
  assetsList: testAssetsList,
  paginationMetadata,
  courseDetails,
  selectAsset: () => { },
  ...selectInitial,
};

let items;
let list;
let wrapper = mountWithIntl(
  <AssetsList
    {...defaultProps}
  />);

const selectAssetSpy = jest.fn();

// use to re-find the following variables after a change is made that would affect them
const updateConstants = () => {
  wrapper.update();

  items = wrapper.find('ol li');
  list = wrapper.find('ol');
};

// use to remount the AssetsList at the start of a test for a clean slate
const resetWrapper = () => {
  wrapper = mountWithIntl(
    <AssetsList
      {...defaultProps}
    />);

  updateConstants();
};

describe('AssetsList', () => {
  updateConstants();

  afterEach(() => {
    resetWrapper();
  });

  describe('renders', () => {
    describe('a list header with', () => {
      const header = wrapper.find('.list-header');

      it('a list header', () => {
        expect(header).toHaveLength(1);
      });

      it('a Name label', () => {
        const nameLabelText = header.find('#name-header WrappedMessage');
        expect(nameLabelText).toHaveLength(1);
        expect(nameLabelText.prop('message')).toEqual(messages.assetsListNameLabel);
      });

      it('a Date Added label', () => {
        const dateAddedLabelText = header.find('#date-added-header WrappedMessage');
        expect(dateAddedLabelText).toHaveLength(1);
        expect(dateAddedLabelText.prop('message')).toEqual(messages.assetsListDateLabel);
      });
    });

    describe('a list with', () => {
      it('an ordered list', () => {
        expect(list).toHaveLength(1);
      });

      it('correct number of list items', () => {
        expect(items).toHaveLength(defaultProps.paginationMetadata.pageSize);
      });

      items.forEach((item, index) => {
        describe(`a list item for ${defaultProps.assetsList[index].display_name} with`, () => {
          describe('a correct thumbnail element with', () => {
            const thumbnailElement = item.find('span').first();
            const thumbnailElementContainer = thumbnailElement.find('div');

            it('a thumbnail element', () => {
              expect(thumbnailElement).toHaveLength(1);
            });

            it('an aria-hidden attribute', () => {
              expect(thumbnailElement.prop('aria-hidden')).toEqual(true);
            });

            it('a thumbnail element', () => {
              expect(thumbnailElement).toHaveLength(1);
            });

            it('a thumbnail element container', () => {
              expect(thumbnailElementContainer).toHaveLength(1);
            });

            it('an assets-list-image-preview-container className', () => {
              expect(thumbnailElementContainer.prop('className').includes('assets-list-image-preview-container')).toEqual(true);
            });

            const thumbnail = defaultProps.assetsList[index].thumbnail;

            if (thumbnail) {
              describe('an img element with', () => {
                const imagePreviewElement = thumbnailElementContainer.find('img');

                it('an img element', () => {
                  expect(imagePreviewElement).toHaveLength(1);
                });

                it('an assets-list-image-preview-image className', () => {
                  expect(imagePreviewElement.prop('className').includes('assets-list-image-preview-image')).toEqual(true);
                });

                it('an empty alt', () => {
                  expect(imagePreviewElement.prop('alt')).toEqual('');
                });

                it('correct src when courseDetails.base_url is defined', () => {
                  expect(imagePreviewElement.prop('src')).toEqual(`${defaultProps.courseDetails.base_url}${thumbnail}`);
                });

                it('correct src when courseDetails.base_url is not defined', () => {
                  const newCourseDetails = { ...defaultProps.courseDetails };

                  newCourseDetails.base_url = '';

                  wrapper.setProps({
                    courseDetails: newCourseDetails,
                  });

                  expect(imagePreviewElement.prop('src')).toEqual(`${defaultProps.courseDetails.base_url}${thumbnail}`);
                });
              });
            } else {
              describe('a noImagePreview element with', () => {
                const noImagePreviewElement = thumbnailElementContainer.find('[data-identifier="asset-image-thumbnail"]');

                it('a noImagePreview element', () => {
                  expect(noImagePreviewElement).toHaveLength(1);
                });

                it('a text-center className', () => {
                  expect(noImagePreviewElement.prop('className').includes('text-center')).toEqual(true);
                });

                it('correct text', () => {
                  const noImagePreviewElementText = thumbnailElementContainer.find(WrappedMessage);
                  expect(noImagePreviewElementText.prop('message')).toEqual(messages.assetsListNoPreview);
                });
              });
            }
          });

          it('a display name element', () => {
            const displayNameElement = item.find(`#asset-name-${index}`);
            expect(displayNameElement).toHaveLength(1);
            expect(displayNameElement.text()).toEqual(defaultProps.assetsList[index].display_name);
          });

          it('a date added element', () => {
            const dateAddedElement = item.find(`#asset-date-${index}`);
            expect(dateAddedElement).toHaveLength(1);
            expect(dateAddedElement.text()).toEqual(defaultProps.assetsList[index].date_added);
          });
        });
      });
    });
  });

  describe('AssetsList', () => {
    it('this.state.selectedAssetIndex is -1 by default', () => {
      expect(wrapper.state('selectedAssetIndex')).toEqual(-1);
    });

    it('this.state.selectedAssetIndex is reset to -1 on pageChange to not selectedAssetPage', () => {
      const newPaginationData = {
        ...defaultProps.paginationMetadata,
        page: 1,
      };

      wrapper.setState({
        selectedAssetIndex: 1,
      });

      wrapper.setProps({
        paginationMetadata: newPaginationData,
      });

      expect(wrapper.state('selectedAssetIndex')).toEqual(-1);
    });

    it('this.state.selectedAssetIndex is reset to to original index on pageChange to selectedAssetPage', () => {
      const assetIndex = 1;

      items.at(assetIndex).simulate('mouseDown');

      wrapper.setProps({
        selectedAsset: defaultProps.assetsList[assetIndex],
      });

      expect(wrapper.state('selectedAssetIndex')).toEqual(assetIndex);

      let newPaginationData = {
        ...defaultProps.paginationMetadata,
        page: 1,
      };

      wrapper.setProps({
        paginationMetadata: newPaginationData,
      });

      expect(wrapper.state('selectedAssetIndex')).toEqual(-1);

      newPaginationData = {
        ...defaultProps.paginationMetadata,
        page: 0,
      };

      wrapper.setProps({
        paginationMetadata: newPaginationData,

      });

      expect(wrapper.state('selectedAssetIndex')).toEqual(assetIndex);
    });

    it('state is cleared when an empty object is passed as a prop', () => {
      wrapper.setProps({
        selectedAsset: defaultProps.assetsList[1],
      });

      wrapper.setState({
        selectedAssetIndex: 1,
        selectedAssetPage: 0,
      });

      wrapper.setProps({
        selectedAsset: {},
      });

      expect(wrapper.state('selectedAssetIndex')).toEqual(-1);
      expect(wrapper.state('selectedAssetPage')).toEqual(-1);
    });

    it('this.state.selectedAssetIndex is set by clicking on a listbox option', () => {
      const assetIndex = 1;

      items.at(assetIndex).simulate('mouseDown');

      expect(wrapper.state('selectedAssetIndex')).toEqual(assetIndex);
    });

    it('this.state.selectedAssetPage is set by clicking on a listbox option', () => {
      items.at(1).simulate('mouseDown');

      expect(wrapper.state('selectedAssetPage')).toEqual(0);
    });

    it('onAssetClick calls selectAsset prop', () => {
      const assetIndex = 1;

      wrapper.setProps({
        selectAsset: selectAssetSpy,
      });

      items.at(assetIndex).simulate('mouseDown');

      expect(selectAssetSpy).toHaveBeenCalledTimes(1);
      expect(selectAssetSpy).toHaveBeenCalledWith(defaultProps.assetsList[assetIndex]);

      selectAssetSpy.mockClear();
    });
  });

  describe('List Box', () => {
    it('has list-group className', () => {
      expect(list.prop('className').includes('list-group')).toEqual(true);
    });

    it('has listbox role', () => {
      expect(list.prop('role')).toEqual('listbox');
    });

    it('has 0 as tabIndex', () => {
      expect(list.prop('tabIndex')).toEqual('0');
    });

    it('has no aria-activedescendant attribute when no asset selected', () => {
      expect(list.prop('aria-activedescendant')).toEqual(null);
    });

    it('has correct aria-activedescendant attribute when asset selected', () => {
      const index = 1;

      wrapper.setState({
        selectedAssetIndex: index,
      });

      updateConstants();

      expect(list.prop('aria-activedescendant')).toEqual(`asset-list-option-${index}`);
    });

    describe('handles focus', () => {
      it('visually selects first asset on focus when no asset is selected', () => {
        expect(wrapper.state('selectedAssetIndex')).toEqual(-1);

        list.simulate('focus');

        expect(wrapper.state('selectedAssetIndex')).toEqual(0);
      });

      it('calls selectAsset prop on focus when no asset is selected', () => {
        wrapper.setProps({
          selectAsset: selectAssetSpy,
        });

        expect(wrapper.state('selectedAssetIndex')).toEqual(-1);

        list.simulate('focus');

        expect(selectAssetSpy).toHaveBeenCalledTimes(1);
        expect(selectAssetSpy).toHaveBeenCalledWith(defaultProps.assetsList[0]);

        selectAssetSpy.mockClear();
      });

      it('maintains original visual selection on focus when asset is selected', () => {
        const newSelectedAssetIndex = 2;

        wrapper.setState({
          selectedAssetIndex: newSelectedAssetIndex,
        });

        list.simulate('focus');

        expect(wrapper.state('selectedAssetIndex')).toEqual(newSelectedAssetIndex);
      });

      it('does not call selectAsset prop on focus when asset is selected', () => {
        wrapper.setState({
          selectedAssetIndex: 2,
        });

        wrapper.setProps({
          selectAsset: selectAssetSpy,
        });

        list.simulate('focus');

        expect(selectAssetSpy).toHaveBeenCalledTimes(0);

        selectAssetSpy.mockClear();
      });
    });

    describe('has a key handler', () => {
      const lastSelectableIndex = defaultProps.paginationMetadata.pageSize - 1;

      describe('arrow down', () => {
        it('arrow down increments this.state.selectedAssetIndex if last asset is not selected', () => {
          expect(wrapper.state('selectedAssetIndex')).toEqual(-1);

          list.simulate('keyDown', { key: 'ArrowDown' });

          expect(wrapper.state('selectedAssetIndex')).toEqual(0);
        });

        it('arrow down sets this.state.selectedAssetPage if last asset is selected', () => {
          expect(wrapper.state('selectedAssetPage')).toEqual(-1);

          list.simulate('keyDown', { key: 'ArrowDown' });

          expect(wrapper.state('selectedAssetPage')).toEqual(0);
        });

        it('arrow down calls selectAsset prop if last asset is not selected', () => {
          wrapper.setProps({
            selectAsset: selectAssetSpy,
          });

          list.simulate('keyDown', { key: 'ArrowDown' });

          expect(selectAssetSpy).toHaveBeenCalledTimes(1);
          expect(selectAssetSpy).toHaveBeenCalledWith(defaultProps.assetsList[0]);

          selectAssetSpy.mockClear();
        });

        it('arrow down does not increment this.state.selectedAssetIndex if last asset is selected', () => {
          wrapper.setState({
            selectedAssetIndex: lastSelectableIndex,
          });

          list.simulate('keyDown', { key: 'ArrowDown' });

          expect(wrapper.state('selectedAssetIndex')).toEqual(lastSelectableIndex);
        });

        it('arrow down does not change this.state.selectedAssetPage if last asset is selected', () => {
          wrapper.setState({
            selectedAssetIndex: lastSelectableIndex,
          });

          list.simulate('keyDown', { key: 'ArrowDown' });

          expect(wrapper.state('selectedAssetPage')).toEqual(-1);
        });

        it('arrow down does not call selectAsset prop if last asset is selected', () => {
          wrapper.setProps({
            selectAsset: selectAssetSpy,
          });

          wrapper.setState({
            selectedAssetIndex: lastSelectableIndex,
          });

          list.simulate('keyDown', { key: 'ArrowDown' });

          expect(selectAssetSpy).toHaveBeenCalledTimes(0);

          selectAssetSpy.mockClear();
        });
      });

      describe('arrow up', () => {
        it('decrements this.state.selectedAssetIndex if first asset is not selected', () => {
          wrapper.setState({
            selectedAssetIndex: lastSelectableIndex,
          });

          list.simulate('keyDown', { key: 'ArrowUp' });

          expect(wrapper.state('selectedAssetIndex')).toEqual(lastSelectableIndex - 1);
        });

        it('arrow up sets this.state.selectedAssetPage if first asset is not selected', () => {
          wrapper.setState({
            selectedAssetIndex: lastSelectableIndex,
          });

          list.simulate('keyDown', { key: 'ArrowUp' });

          expect(wrapper.state('selectedAssetPage')).toEqual(0);
        });

        it('arrow up calls selectAsset prop if first asset is not selected', () => {
          wrapper.setProps({
            selectAsset: selectAssetSpy,
          });

          wrapper.setState({
            selectedAssetIndex: lastSelectableIndex,
          });

          list.simulate('keyDown', { key: 'ArrowUp' });

          expect(selectAssetSpy).toHaveBeenCalledTimes(1);
          expect(selectAssetSpy)
            .toHaveBeenCalledWith(defaultProps.assetsList[lastSelectableIndex - 1]);

          selectAssetSpy.mockClear();
        });

        it('arrow up does not decrement this.state.selectedAssetIndex if first asset is selected', () => {
          wrapper.setState({
            selectedAssetIndex: 0,
          });

          list.simulate('keyDown', { key: 'ArrowUp' });

          expect(wrapper.state('selectedAssetIndex')).toEqual(0);
        });

        it('arrow up does not change this.state.selectedAssetPage if first asset is selected', () => {
          wrapper.setState({
            selectedAssetIndex: 0,
          });

          list.simulate('keyDown', { key: 'ArrowUp' });

          expect(wrapper.state('selectedAssetPage')).toEqual(-1);
        });

        it('arrow up does not call selectAsset prop if first asset is selected', () => {
          wrapper.setProps({
            selectAsset: selectAssetSpy,
          });

          list.simulate('keyDown', { key: 'ArrowUp' });

          expect(selectAssetSpy).toHaveBeenCalledTimes(0);

          selectAssetSpy.mockClear();
        });
      });
    });
  });

  describe('List Box Option', () => {
    items.forEach((item, index) => {
      describe(`list box option at index ${index} has correct static props`, () => {
        it('className', () => {
          expect(item.prop('className').includes('list-group-item list-group-item-action')).toEqual(true);
          expect(item.prop('className').includes('active')).toEqual(false);
        });

        it('id', () => {
          expect(item.prop('id')).toEqual(`asset-list-option-${index}`);
        });

        it('role', () => {
          expect(item.prop('role')).toEqual('option');
        });

        it('tabIndex', () => {
          expect(item.prop('tabIndex')).toEqual('-1');
        });

        it('aria-labelledby', () => {
          expect(item.prop('aria-labelledby')).toEqual(`name-header asset-name-${index} date-added-header asset-date-${index}`);
        });
      });
    });

    it('has active className when selected', () => {
      const selectedAssetIndex = 2;
      const selectedAsset = defaultProps.assetsList[selectedAssetIndex];

      wrapper.setProps({
        selectedAsset,
      });

      updateConstants();

      expect(items.at(selectedAssetIndex).prop('className').includes('active')).toEqual(true);
    });

    it('has aria-selected attribute when selected', () => {
      const selectedAssetIndex = 2;
      const selectedAsset = defaultProps.assetsList[selectedAssetIndex];

      wrapper.setProps({
        selectedAsset,
      });

      updateConstants();

      expect(items.at(selectedAssetIndex).prop('aria-selected')).toEqual(true);
    });
  });
});

