import React from 'react';
import PropTypes from 'prop-types';

import edxBootstrap from '../../SFE.scss';
import { hasSearchOrFilterApplied } from '../../utils/getAssetsFilters';
import styles from './AssetsResultsCount.scss';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import messages from './displayMessages';

const renderCount = count => (
  <span className={`${edxBootstrap['font-weight-bold']}`}>
    {count}
  </span>
);

const AssetsResultsCount = ({ paginationMetaData, filtersMetaData, searchMetaData }) => {
  let message = messages.assetsResultsCountTotal;
  if (hasSearchOrFilterApplied(filtersMetaData.assetTypes, searchMetaData.search)) {
    message = messages.assetsResultsCountFiltered;
  }

  return (
    <div className={styles['result-count-wrapper']}>
      <WrappedMessage
        message={message}
        values={{
          start: renderCount(paginationMetaData.start + 1),
          end: renderCount(paginationMetaData.end),
          total: renderCount(paginationMetaData.totalCount),
        }}
      />
    </div>
  );
};

AssetsResultsCount.propTypes = {
  paginationMetaData: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
    page: PropTypes.number,
    pageSize: PropTypes.number,
    totalCount: PropTypes.number,
  }).isRequired,
  filtersMetaData: PropTypes.shape({
    assetTypes: PropTypes.object,
  }).isRequired,
  searchMetaData: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default AssetsResultsCount;
