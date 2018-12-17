import * as clientApi from '../api/client';

const requestChangeAdvancedSettings = (parameters, courseDetails) => {
    dispatch => (
        clientApi.requestChangeAdvancedSettings(courseDetails.id, parameters)
        .then((response) => {
            if (response.ok) {
              return dispatch(getAssets({}, courseDetails)).then(() => (
                dispatch(deleteAssetSuccess(asset))
              ));
            }
            return dispatch(deleteAssetFailure(asset));
          });
        )
    )
}