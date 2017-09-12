import React from 'react';
import PropTypes from 'prop-types';
import Table from 'paragon/src/Table';

const AssetsTable = ({ assetsList }) => (
  (!assetsList.length) ? (
    <span>Loading....</span>
  ) : (
    <Table
      headings={[
        {
          display: 'Name',
          key: 'display_name',
        },
        {
          display: 'Type',
          key: 'content_type',
        },
        {
          display: 'Date Added',
          key: 'date_added',
        },
      ]}
      data={assetsList}
    />
  )
);

AssetsTable.propTypes = {
  assetsList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AssetsTable;
