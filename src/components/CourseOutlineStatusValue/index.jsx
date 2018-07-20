
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import styles from './CourseOutlineStatusValue.scss';

function CourseOutlineStatusValue(props) {
  return (
    <React.Fragment>
      <div className={classNames('d-block', styles['status-value'])}>
        {props.children}
      </div>
    </React.Fragment>
  );
}

CourseOutlineStatusValue.propTypes = {
  children: PropTypes.element,
};

CourseOutlineStatusValue.defaultProps = {
  children: null,
};

export default CourseOutlineStatusValue;
