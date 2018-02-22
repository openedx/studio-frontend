import React from 'react';
import PropTypes from 'prop-types';

import edxBootstrap from '../../SFE.scss';
import { hasSelectedFilters } from '../../utils/getAssetsFilters';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import messages from './displayMessages';

const renderCount = count => (
  <span className={`${edxBootstrap['font-weight-bold']}`}>
    {count}
  </span>
);

const AssetsResultsCount = ({ paginationMetaData, filtersMetaData, searchMetaData }) => {
  if (hasSelectedFilters(filtersMetaData.assetTypes) ||
      (searchMetaData.search && searchMetaData.search.length > 0)) {
    return (
      <WrappedMessage
        message={messages.assetsResultsCountFiltered}
        values={{
          start: renderCount(paginationMetaData.start + 1),
          end: renderCount(paginationMetaData.end),
          total: renderCount(paginationMetaData.totalCount),
        }}
      />
    );
  }
  return (
    <WrappedMessage
      message={messages.assetsResultsCountTotal}
      values={{
        start: renderCount(paginationMetaData.start + 1),
        end: renderCount(paginationMetaData.end),
        total: renderCount(paginationMetaData.totalCount),
      }}
    />
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
