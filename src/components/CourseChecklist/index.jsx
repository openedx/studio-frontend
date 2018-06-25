import classNames from 'classnames';
import { elementType } from 'airbnb-prop-types';
import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';
import { Hyperlink, Icon } from '@edx/paragon';
import PropTypes from 'prop-types';
import React from 'react';

import getFilteredChecklist from '../../utils/CourseChecklist/getFilteredChecklist';
import getValidatedValue from '../../utils/CourseChecklist/getValidatedValue';
import messages from './displayMessages';
import styles from './CourseChecklist.scss';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';

class CourseChecklist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checks: [],
      totalCompletedChecks: 0,
      values: {},
    };
  }

  componentWillMount() {
    this.updateChecklistState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateChecklistState(nextProps);
  }

  getCompletionCountID = () => (`${this.props.idPrefix.split(/\s/).join('-')}-completion-count`);

  getHeading = () => (
    <h3 aria-describedby={this.getCompletionCountID()} className={classNames('font-weight-normal', 'font-extra-large')}>
      {this.props.dataHeading}
    </h3>
  )

  getCompletionCount = () => {
    const totalCompletedChecks = Object.values(this.state.checks).length;

    return (
      <WrappedMessage
        message={messages.completionCountLabel}
        values={{ completed: this.state.totalCompletedChecks, total: totalCompletedChecks }}
      >
        {displayText =>
          (<div
            className="font-large"
            id={this.getCompletionCountID()}
          >
            {displayText}
          </div>)
        }
      </WrappedMessage>
    );
  }

  getCompletionIcon = (checkID) => {
    const isCompleted = this.isCheckCompleted(checkID);
    const message = isCompleted ? messages.completedItemLabel : messages.uncompletedItemLabel;

    return (
      <WrappedMessage message={message}>
        {displayText => (
          <Icon
            className={[classNames(
              'm-4 col-1',
              FontAwesomeStyles.fa,
              FontAwesomeStyles['fa-2x'],
              this.getCompletionIconClassNames(isCompleted)),
            ]}
            id={`icon-${checkID}`}
            screenReaderText={displayText}
          />
        )
        }
      </WrappedMessage>
    );
  }

  getCompletionIconClassNames = isCompleted => (
    isCompleted ? ['fa-check-circle', 'text-success'] : ['fa-circle-thin', styles['checklist-icon-incomplete']]
  );

  getChecklistItemColorClassName = isCompleted => (
    isCompleted ? styles['checklist-item-complete'] : styles['checklist-item-incomplete']
  );

  getShortDescription = checkID => (
    <div className="font-large">
      <WrappedMessage message={messages[`${checkID}ShortDescription`]} />
    </div>
  );

  getLongDescription = checkID => (
    <div className="font-small">
      <WrappedMessage message={messages[`${checkID}LongDescription`]} />
    </div>
  )

  getUpdateLinkDestination = (checkID) => {
    switch (checkID) {
      case 'welcomeMessage': return this.props.links.course_updates;
      case 'gradingPolicy': return this.props.links.grading_policy;
      case 'certificate': return this.props.links.certificates;
      case 'courseDates': return `${this.props.links.settings}#schedule`;
      default: return null;
    }
  }

  getUpdateLink = checkID => (
    <div className="col-1">
      <Hyperlink
        className={classNames(styles.btn, styles['btn-primary'], styles['checklist-item-link'])}
        content={<WrappedMessage message={messages.updateLinkLabel} />}
        destination={this.getUpdateLinkDestination(checkID)}
      />
    </div>
  );

  getListItems = () => (
    this.state.checks.map((check) => {
      const isCompleted = this.isCheckCompleted(check.id);

      return (
        <div
          className={classNames(
            'bg-white border my-1 py-4',
            this.getChecklistItemColorClassName(isCompleted),
            styles['checklist-item'])
          }
          id={`checklist-item-${check.id}`}
          key={check.id}
        >
          <div className="row no-gutters">
            {this.getCompletionIcon(check.id)}
            <div className="col">
              {this.getShortDescription(check.id)}
              {this.getLongDescription(check.id)}
            </div>
            {this.shouldShowUpdateLink(check.id) ? this.getUpdateLink(check.id) : null}
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
      let totalCompletedChecks = 0;

      checks.forEach((check) => {
        const value = getValidatedValue(props, check.id);

        if (value) {
          totalCompletedChecks += 1;
        }

        values[check.id] = value;
      });

      this.setState({
        checks,
        totalCompletedChecks,
        values,
      });
    }
  }

  isCheckCompleted = checkID => (this.state.values[checkID])

  shouldShowUpdateLink = (checkID) => {
    switch (checkID) {
      case 'welcomeMessage': return true;
      case 'gradingPolicy': return true;
      case 'certificate': return true;
      case 'courseDates': return true;
      default: return false;
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
        <div className="row no-gutters">
          <div className="col">
            {this.getListItems()}
          </div>
        </div>
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
  dataHeading: elementType(WrappedMessage).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  dataList: PropTypes.arrayOf(PropTypes.object).isRequired,
  idPrefix: PropTypes.string.isRequired,
  links: PropTypes.objectOf(PropTypes.string).isRequired,
};
