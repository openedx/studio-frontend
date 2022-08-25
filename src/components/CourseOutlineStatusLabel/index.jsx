import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import styles from './CourseOutlineStatusLabel.scss';

function CourseOutlineStatusLabel(props) {
  return (
    <h2 className={classNames('mb-2', styles['status-label'])}>
      {props.children}
    </h2>
  );
}

CourseOutlineStatusLabel.propTypes = {
  children: PropTypes.element,
};

CourseOutlineStatusLabel.defaultProps = {
  children: null,
};

export default CourseOutlineStatusLabel;
