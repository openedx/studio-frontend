import React from 'react';
import { StatusAlert } from '@edx/paragon';

import AssestStatusAlert from './index';
import messages from './displayMessages';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import { assetActions } from '../../data/constants/actionTypes';
import { mountWithIntl } from '../../utils/i18n/enzymeHelper';
import { testAssetsList } from '../../utils/testConstants';

const statusAlertIsClosed = (wrapper) => {
  expect(wrapper.state('statusAlertFields').alertDialog).toEqual('');
  expect(wrapper.state('statusAlertFields').alertType).toEqual('info');
  expect(wrapper.state('statusAlertOpen')).toEqual(false);
  expect(wrapper.state('uploadSuccessCount')).toEqual(1);
};

const statusAlertIsOpen = (wrapper) => {
  expect(wrapper.state('statusAlertOpen')).toEqual(true);
  expect(wrapper.find(StatusAlert).exists()).toEqual(true);
};

const statusAlertIsCorrectType = (wrapper, alertType) => {
  const statusAlert = wrapper.find(StatusAlert);
  const statusAlertType = statusAlert.prop('alertType');

  expect(statusAlertType).toEqual(alertType);
  expect(statusAlert.find('div').first().hasClass(`alert-${alertType}`)).toEqual(true);
};

const statusAlertHasCorrectMessage = (wrapper, message) => {
  const statusAlert = wrapper.find(StatusAlert);
  const statusAlertMessage = statusAlert.find(WrappedMessage);

  expect(statusAlertMessage.prop('message')).toEqual(message);
};

const triggerOpenStatusAlertWithType = (wrapper, type, extraProps = {}) => {
  wrapper.setProps({
    assetsStatus: {
      type,
      ...extraProps,
    },
  });
};

const assetName = testAssetsList[0].display_name;

const testData = [
  {
    actionType: assetActions.delete.DELETE_ASSET_FAILURE,
    alertType: 'danger',
    message: messages.assetsStatusAlertCantDelete,
    extraProps: {
      assetName,
    },
  },
  {
    actionType: assetActions.delete.DELETE_ASSET_SUCCESS,
    alertType: 'success',
    message: messages.assetsStatusAlertDeleteSuccess,
    extraProps: {
      assetName,
    },
  },
  {
    actionType: assetActions.upload.UPLOAD_ASSET_SUCCESS,
    alertType: 'success',
    message: messages.assetsStatusAlertUploadSuccess,
    extraProps: {},
  },
  {
    actionType: assetActions.upload.UPLOADING_ASSETS,
    alertType: 'info',
    message: messages.assetsStatusAlertUploadInProgress,
    extraProps: {
      count: 1,
    },
  },
  {
    actionType: assetActions.upload.UPLOAD_EXCEED_MAX_COUNT_ERROR,
    alertType: 'danger',
    message: messages.assetsStatusAlertTooManyFiles,
    extraProps: {
      maxFileCount: 1,
    },
  },
  {
    actionType: assetActions.upload.UPLOAD_EXCEED_MAX_SIZE_ERROR,
    alertType: 'danger',
    message: messages.assetsStatusAlertTooMuchData,
    extraProps: {
      maxFileSizeMB: 1,
    },
  },
  {
    actionType: assetActions.upload.UPLOAD_ASSET_FAILURE,
    alertType: 'danger',
    message: messages.assetsStatusAlertGenericError,
    extraProps: {
      asset: { name: assetName },
    },
  },
  {
    actionType: assetActions.lock.TOGGLING_LOCK_ASSET_FAILURE,
    alertType: 'danger',
    message: messages.assetsStatusAlertFailedLock,
    extraProps: {
      asset: { name: assetName },
    },
  },
  {
    actionType: assetActions.clear.CLEAR_FILTERS_FAILURE,
    alertType: 'danger',
    message: messages.assetsStatusAlertGenericUpdateError,
    extraProps: {},
  },
  {
    actionType: assetActions.filter.FILTER_UPDATE_FAILURE,
    alertType: 'danger',
    message: messages.assetsStatusAlertGenericUpdateError,
    extraProps: {},
  },

  {
    actionType: assetActions.paginate.PAGE_UPDATE_FAILURE,
    alertType: 'danger',
    message: messages.assetsStatusAlertGenericUpdateError,
    extraProps: {},
  },

  {
    actionType: assetActions.sort.SORT_UPDATE_FAILURE,
    alertType: 'danger',
    message: messages.assetsStatusAlertGenericUpdateError,
    extraProps: {},
  },
];

const defaultProps = {
  assetsStatus: {},
  clearAssetsStatus: () => { },
  deletedAsset: {},
  onDeleteStatusAlertClose: () => { },
};

let wrapper;

describe('AssetsStatusAlert', () => {
  describe('renders', () => {
    testData.forEach((test) => {
      it(`on ${test.actionType}`, () => {
        wrapper = mountWithIntl(
          <AssestStatusAlert
            {...defaultProps}
          />,
        );

        wrapper.setProps({
          assetsStatus: {
            type: test.actionType,
            ...test.extraProps,
          },
        });

        statusAlertIsOpen(wrapper);
        statusAlertIsCorrectType(wrapper, test.alertType);
        statusAlertHasCorrectMessage(wrapper, test.message);
      });
    });

    it('closed by the default', () => {
      wrapper = mountWithIntl(
        <AssestStatusAlert
          {...defaultProps}
        />,
      );

      statusAlertIsClosed(wrapper);
    });

    it('calls statusAlertRef prop', () => {
      const statusAlertRefSpy = jest.fn();

      wrapper = mountWithIntl(
        <AssestStatusAlert
          {...defaultProps}
          statusAlertRef={statusAlertRefSpy}
        />,
      );

      expect(statusAlertRefSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('behaves', () => {
    it('opening status alert focuses on the close button', () => {
      wrapper = mountWithIntl(
        <AssestStatusAlert
          {...defaultProps}
        />,
      );

      triggerOpenStatusAlertWithType(wrapper, assetActions.sort.SORT_UPDATE_FAILURE);

      const statusAlert = wrapper.find(StatusAlert);
      const closeStatusAlertButton = statusAlert.find('button').filterWhere(button => button.text() === '×');

      expect(closeStatusAlertButton.html()).toEqual(document.activeElement.outerHTML);
    });

    it('clicking close button closes the status alert', () => {
      wrapper = mountWithIntl(
        <AssestStatusAlert
          {...defaultProps}
        />,
      );

      triggerOpenStatusAlertWithType(wrapper, assetActions.sort.SORT_UPDATE_FAILURE);

      const statusAlert = wrapper.find(StatusAlert);
      const closeStatusAlertButton = statusAlert.find('button').filterWhere(button => button.text() === '×');

      closeStatusAlertButton.simulate('click');
      statusAlertIsClosed(wrapper);
    });

    it('clicking close button calls clearAssetsStatusProp', () => {
      const clearAssetsStatusSpy = jest.fn();

      wrapper = mountWithIntl(
        <AssestStatusAlert
          {...defaultProps}
          clearAssetsStatus={clearAssetsStatusSpy}
        />,
      );

      triggerOpenStatusAlertWithType(wrapper, assetActions.sort.SORT_UPDATE_FAILURE);

      const statusAlert = wrapper.find(StatusAlert);
      const closeStatusAlertButton = statusAlert.find('button').filterWhere(button => button.text() === '×');

      closeStatusAlertButton.simulate('click');
      expect(clearAssetsStatusSpy).toHaveBeenCalledTimes(1);
    });

    it('clicking close button on delete status alert closes the status alert', () => {
      wrapper = mountWithIntl(
        <AssestStatusAlert
          {...defaultProps}
        />,
      );

      const extraProps = {
        asset: { name: assetName },
      };

      triggerOpenStatusAlertWithType(wrapper, assetActions.delete.DELETE_ASSET_SUCCESS, extraProps);

      const statusAlert = wrapper.find(StatusAlert);
      const closeStatusAlertButton = statusAlert.find('button').filterWhere(button => button.text() === '×');

      closeStatusAlertButton.simulate('click');
      statusAlertIsClosed(wrapper);
    });

    it('clicking close button calls clearAssetsStatusProp', () => {
      const clearAssetsStatusSpy = jest.fn();

      wrapper = mountWithIntl(
        <AssestStatusAlert
          {...defaultProps}
          clearAssetsStatus={clearAssetsStatusSpy}
        />,
      );

      const extraProps = {
        asset: { name: assetName },
      };

      triggerOpenStatusAlertWithType(wrapper, assetActions.delete.DELETE_ASSET_SUCCESS, extraProps);

      const statusAlert = wrapper.find(StatusAlert);
      const closeStatusAlertButton = statusAlert.find('button').filterWhere(button => button.text() === '×');

      closeStatusAlertButton.simulate('click');
      expect(clearAssetsStatusSpy).toHaveBeenCalledTimes(1);
    });

    it('clicking close button calls onDeleteStatusAlertClose', () => {
      const onDeleteStatusAlertCloseSpy = jest.fn();

      wrapper = mountWithIntl(
        <AssestStatusAlert
          {...defaultProps}
          onDeleteStatusAlertClose={onDeleteStatusAlertCloseSpy}
        />,
      );

      const extraProps = {
        asset: { name: assetName },
      };

      triggerOpenStatusAlertWithType(wrapper, assetActions.delete.DELETE_ASSET_SUCCESS, extraProps);

      const statusAlert = wrapper.find(StatusAlert);
      const closeStatusAlertButton = statusAlert.find('button').filterWhere(button => button.text() === '×');

      closeStatusAlertButton.simulate('click');
      expect(onDeleteStatusAlertCloseSpy).toHaveBeenCalledTimes(1);
    });

    it('increments uploadSuccessCount on UPLOAD_ASSET_SUCCESS', () => {
      wrapper = mountWithIntl(
        <AssestStatusAlert
          {...defaultProps}
        />,
      );

      const initialUploadSuccessCount = wrapper.state('uploadSuccessCount');

      triggerOpenStatusAlertWithType(wrapper, assetActions.upload.UPLOAD_ASSET_SUCCESS);

      expect(wrapper.state('uploadSuccessCount')).toEqual(initialUploadSuccessCount + 1);
    });

    it('default updateStatusAlertFields condition does not modify status alert from default status alert state', () => {
      wrapper = mountWithIntl(
        <AssestStatusAlert
          {...defaultProps}
        />,
      );

      // SORT_UPDATE will hit the default case of the switch statement in updateStatusAlertFields
      triggerOpenStatusAlertWithType(wrapper, assetActions.sort.SORT_UPDATE);

      statusAlertIsClosed(wrapper);
    });

    it('default updateStatusAlertFields condition does not modify status alert from open status alert', () => {
      wrapper = mountWithIntl(
        <AssestStatusAlert
          {...defaultProps}
        />,
      );

      triggerOpenStatusAlertWithType(wrapper, assetActions.sort.SORT_UPDATE_FAILURE);

      const initialState = wrapper.state();

      triggerOpenStatusAlertWithType(wrapper, assetActions.sort.SORT_UPDATE);

      expect(initialState).toEqual(wrapper.state());
    });
  });
});
