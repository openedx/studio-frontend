import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@edx/paragon';
import classNames from 'classnames';
import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';
import getFilteredChecklist from '../../utils/CourseChecklist/getFilteredChecklist';
import getValidatedValue from '../../utils/CourseChecklist/getValidatedValue';
import styles from './CourseChecklist.scss';

class CourseChecklist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      headingID: '',
      checks: [],
      totalChecks: 0,
      values: {},
    };
  }

  componentWillMount() {
    this.updateChecklistState(this.props);

    if (this.props.dataHeading) {
      this.setState({
        headingID: `${this.props.dataHeading.split(/\s/).join('-')}-heading`,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.updateChecklistState(nextProps);
  }

  getHeading = () => (
    <h3 className={classNames('font-weight-normal', styles['font-extra-large'])}>
      <span id={this.state.headingID}>{this.props.dataHeading}</span>
    </h3>
  )


  getCompletionCount = () => {
    const totalChecks = Object.values(this.state.checks).length;

    return (
      <div aria-describedby={this.state.headingID} className={classNames(styles['font-large'])} id={'completion-count'}>{`${this.state.totalChecks}/${totalChecks} completed`}</div>
    );
  }

  getIconClassNames = (check) => {
    const isComplete = this.state.values[check.id];

    return isComplete ? classNames('fa-check-circle', 'text-success') : classNames('fa-circle-thin', styles['checklist-icon-incomplete']);
  }

  getListItems = () =>
    (
      this.state.checks.map((check) => {
        const isComplete = this.state.values[check.id];
        const itemColorClassName = isComplete ? styles['checklist-item-complete'] : styles['checklist-item-incomplete'];
        return (
          <div id={`checklist-item-${check.id}`} className={classNames('row no-gutters bg-white border my-1 py-4', itemColorClassName)} key={check.id}>
            <Icon className={[classNames('m-4 col-1', FontAwesomeStyles.fa, FontAwesomeStyles['fa-2x'], this.getIconClassNames(check))]} id={`icon-${check.id}`} />
            <div className="col">
              <div className={classNames(styles['font-large'])}>{check.shortDescription}</div>
              <div className={classNames(styles['font-small'])}>{check.longDescription}</div>
            </div>
          </div>
        );
      })
    );

  updateChecklistState(props) {
    if (Object.keys(props.data).length > 0) {
      const checks = getFilteredChecklist(
        props.dataList, props.data.is_self_paced);

      const values = {};
      let totalChecks = 0;

      checks.forEach((check) => {
        const value = getValidatedValue(props, check.id);

        if (value) {
          totalChecks += 1;
        }

        values[check.id] = value;
      });

      this.setState({
        checks,
        totalChecks,
        values,
      });
    }
  }

  render() {
    return (
      <div className="container mb-5">
        <div className="row no-gutters py-2">
          <div className="col">
            {this.getHeading()}
          </div>
        </div>
        <div className="row no-gutters">
          <div className="col">
            {this.getCompletionCount()}
          </div>
        </div>
        {this.getListItems()}
      </div>
    );
  }
}

export default CourseChecklist;

CourseChecklist.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  data: PropTypes.oneOfType([
    PropTypes.shape({
      assignments: PropTypes.shape({
        total_number: PropTypes.number,
        total_visible: PropTypes.number,
        num_with_dates_before_end: PropTypes.number,
        num_with_dates: PropTypes.number,
        num_with_dates_after_start: PropTypes.number,
      }),
      dates: PropTypes.shape({
        has_start_date: PropTypes.bool,
        has_end_date: PropTypes.bool,
      }),
      updates: PropTypes.shape({
        has_update: PropTypes.bool,
      }),
      certificates: PropTypes.shape({
        is_activated: PropTypes.bool,
        has_certificate: PropTypes.bool,
      }),
      grades: PropTypes.shape({
        sum_of_weights: PropTypes.number,
      }),
      is_self_paced: PropTypes.bool,
    }).isRequired,
    PropTypes.shape({
      assignments: PropTypes.shape({
        total_number: PropTypes.number,
        total_visible: PropTypes.number,
        num_with_dates_before_end: PropTypes.number,
        num_with_dates: PropTypes.number,
        num_with_dates_after_start: PropTypes.number,
      }),
      dates: PropTypes.shape({
        has_start_date: PropTypes.bool,
        has_end_date: PropTypes.bool,
      }),
      updates: PropTypes.shape({
        has_update: PropTypes.bool,
      }),
      certificates: PropTypes.shape({
        is_activated: PropTypes.bool,
        has_certificate: PropTypes.bool,
      }),
      grades: PropTypes.shape({
        sum_of_weights: PropTypes.number,
      }),
      is_self_paced: PropTypes.bool,
    }).isRequired,
  ]).isRequired,
  dataHeading: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  dataList: PropTypes.arrayOf(PropTypes.object).isRequired,
};
