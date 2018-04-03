import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';

import { hasSearchOrFilterApplied } from '../../utils/getAssetsFilters';
import styles from './AssetsResultsCount.scss';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import messages from './displayMessages';

const renderCount = count => (
  <span className="font-weight-bold">
    <FormattedNumber value={count} />
  </span>
);

const AssetsResultsCount = ({ paginationMetadata, filtersMetadata, searchMetadata }) => {
  let message = messages.assetsResultsCountTotal;
  if (hasSearchOrFilterApplied(filtersMetadata.assetTypes, searchMetadata.search)) {
    message = messages.assetsResultsCountFiltered;
  }

  return (
    <div className={styles['result-count-wrapper']}>
      <WrappedMessage
        message={message}
        values={{
          start: renderCount(paginationMetadata.start + 1),
          end: renderCount(paginationMetadata.end),
          formatted_total: renderCount(paginationMetadata.totalCount),
          total: paginationMetadata.totalCount,
        }}
      />
    </div>
  );
};

AssetsResultsCount.propTypes = {
  paginationMetadata: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
    page: PropTypes.number,
    pageSize: PropTypes.number,
    totalCount: PropTypes.number,
  }).isRequired,
  filtersMetadata: PropTypes.shape({
    assetTypes: PropTypes.object,
  }).isRequired,
  searchMetadata: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default AssetsResultsCount;
