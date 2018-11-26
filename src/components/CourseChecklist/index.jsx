import classNames from 'classnames';
import { elementType } from 'airbnb-prop-types';
import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';
import { FormattedNumber } from 'react-intl';
import { Hyperlink, Icon } from '@edx/paragon';
import PropTypes from 'prop-types';
import React from 'react';

import { trackEvent } from '../../utils/analytics';
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

    this.spinnerClasses = [FontAwesomeStyles.fa, FontAwesomeStyles['fa-spinner'], FontAwesomeStyles['fa-spin'], FontAwesomeStyles['fa-5x']];

    this.onAssignmentHyperlinkClick = this.onAssignmentHyperlinkClick.bind(this);
    this.onCheckUpdateHyperlinkClick = this.onCheckUpdateHyperlinkClick.bind(this);
  }

  componentWillMount() {
    this.updateChecklistState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateChecklistState(nextProps);
  }

  onAssignmentHyperlinkClick = (assignmentID) => {
    trackEvent(
      'edx.bi.studio.course.checklist.invalid-assignment.clicked', {
        category: 'click',
        event_type: `invalid-assignment-${assignmentID}`,
        label: this.props.studioDetails.course.id,
      },
    );
  }

  onCheckUpdateHyperlinkClick = (checkID) => {
    trackEvent(
      'edx.bi.studio.course.checklist.update.clicked', {
        category: 'click',
        event_type: `update-${checkID}`,
        label: this.props.studioDetails.course.id,
      },
    );
  }

  getCompletionCountID = () => (`${this.props.idPrefix.split(/\s/).join('-')}-completion-count`);

  getHeading = () => (
    <h3 aria-describedby={this.getCompletionCountID()} className={classNames('font-weight-normal', 'font-extra-large')}>
      {this.props.dataHeading}
    </h3>
  )

  getCompletionCount = () => {
    const totalCompletedChecks = Object.values(this.state.checks).length;

    return this.props.isLoading ?
      null :
      (
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
          <div className="text-center">
            <Icon
              className={[classNames(
                FontAwesomeStyles.fa,
                FontAwesomeStyles['fa-2x'],
                this.getCompletionIconClassNames(isCompleted)),
              ]}
              id={`icon-${checkID}`}
              screenReaderText={displayText}
            />
          </div>
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
  );

  getUpdateLinkDestination = (checkID) => {
    switch (checkID) {
      case 'welcomeMessage': return this.props.studioDetails.links.course_updates;
      case 'gradingPolicy': return this.props.studioDetails.links.grading_policy;
      case 'certificate': return this.props.studioDetails.links.certificates;
      case 'courseDates': return `${this.props.studioDetails.links.settings}#schedule`;
      default: return null;
    }
  }

  getUpdateLink = checkID => (
    <div className="col-1">
      <Hyperlink
        className={classNames('px-3', styles.btn, styles['btn-primary'], styles['checklist-item-link'])}
        content={<WrappedMessage message={messages.updateLinkLabel} />}
        destination={this.getUpdateLinkDestination(checkID)}
        onClick={() => this.onCheckUpdateHyperlinkClick(checkID)}
      />
    </div>
  );

  getLoadingIcon = () => (
    <WrappedMessage message={messages.loadingChecklistLabel}>
      {displayText =>
        (<div className="text-center">
          <Icon
            className={[classNames(...this.spinnerClasses)]}
            screenReaderText={displayText}
          />
        </div>)
      }
    </WrappedMessage>
  )

  getBody = () => (
    this.props.isLoading ? this.getLoadingIcon() : this.getListItems()
  )

  getListItems = () => (
    this.state.checks.map((check) => {
      const isCompleted = this.isCheckCompleted(check.id);
      const shouldShowCommentSection = this.shouldShowCommentSection(check.id);

      return (
        <div
          className={classNames(
            'bg-white border my-2',
            { 'pt-4': shouldShowCommentSection, 'py-4': !shouldShowCommentSection },
            this.getChecklistItemColorClassName(isCompleted),
            styles['checklist-item'])
          }
          id={`checklist-item-${check.id}`}
          key={check.id}
        >
          <div className="align-items-center no-gutters row">
            <div className="col-1">
              {this.getCompletionIcon(check.id)}
            </div>
            <div className="col">
              {this.getShortDescription(check.id)}
              {this.getLongDescription(check.id)}
            </div>
            {this.shouldShowUpdateLink(check.id) ? this.getUpdateLink(check.id) : null}
          </div>
          {shouldShowCommentSection ? this.getCommentSection(check.id) : null}
        </div>
      );
    })
  );

  getCommentSectionIcon = () => (
    <div className="text-center">
      <Icon
        className={[classNames(
          FontAwesomeStyles.fa,
          FontAwesomeStyles['fa-lg'],
          FontAwesomeStyles['fa-comment'],
          styles['comment-icon'],
        )]
        }
      />
    </div>
  );

  getGradingPolicyCommentSection = () => (
    this.getComment(
      <WrappedMessage
        message={messages.gradingPolicyComment}
        values={{
          percent: <FormattedNumber
            maximumFractionDigits={2}
            minimumFractionDigits={2}
            value={(this.props.data.grades.sum_of_weights * 100).toFixed(2)}
          />,
        }}
      />,
    )
  );

  getAssignmentDeadlineCommentSection = () => {
    const allGradedAssignmentsOutsideDateRange = [].concat(
      this.props.data.assignments.assignments_with_dates_before_start,
      this.props.data.assignments.assignments_with_dates_after_end,
      this.props.data.assignments.assignments_with_ora_dates_before_start,
      this.props.data.assignments.assignments_with_ora_dates_after_end,
    );

    // de-dupe in case one assignment has multiple violations
    const assignmentsMap = new Map();
    allGradedAssignmentsOutsideDateRange.forEach(
      (assignment) => { assignmentsMap.set(assignment.id, assignment); },
    );
    const gradedAssignmentsOutsideDateRange = [];
    assignmentsMap.forEach(
      (value) => {
        gradedAssignmentsOutsideDateRange.push(value);
      },
    );

    const message = (
      <React.Fragment>
        <WrappedMessage message={messages.assignmentDeadlinesComment} />
        <ul className={styles['assignment-list']}>
          {
            gradedAssignmentsOutsideDateRange.map(assignment => (
              <li className={classNames(styles['assignment-list-item'], 'pr-2')} key={assignment.id}>
                <Hyperlink
                  content={assignment.display_name}
                  destination={`${this.props.studioDetails.links.course_outline}#${assignment.id}`}
                  onClick={() => this.onAssignmentHyperlinkClick(assignment.id)}
                />
              </li>
            ))
          }
        </ul>
      </React.Fragment>
    );

    return this.getComment(message);
  }

  getCommentSection = (checkID) => {
    switch (checkID) {
      case 'gradingPolicy': return this.getGradingPolicyCommentSection();
      case 'assignmentDeadlines': return this.getAssignmentDeadlineCommentSection();
      default: return null;
    }
  }

  getComment = comment => (
    <div className={classNames('align-items-center no-gutters border-top mt-4 row')} data-identifier="comment">
      <div className="col-1">
        {this.getCommentSectionIcon()}
      </div>
      <div className="col my-4 font-small">
        {comment}
      </div>
    </div>
  )

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

  shouldShowGradingPolicyCommentSection = () => (
    Object.keys(this.props.data).length > 0 && this.props.data.grades.sum_of_weights !== 1
  )

  shouldShowAssignmentDeadlinesCommentSection = () => (
    Object.keys(this.props.data).length > 0 &&
    (
      this.props.data.assignments.assignments_with_dates_before_start.length > 0 ||
      this.props.data.assignments.assignments_with_dates_after_end.length > 0 ||
      this.props.data.assignments.assignments_with_ora_dates_before_start.length > 0 ||
      this.props.data.assignments.assignments_with_ora_dates_after_end.length > 0
    )
  )

  shouldShowCommentSection = (checkID) => {
    if (checkID === 'gradingPolicy' && this.shouldShowGradingPolicyCommentSection()) {
      return true;
    } else if (checkID === 'assignmentDeadlines' && this.shouldShowAssignmentDeadlinesCommentSection()) {
      return true;
    }

    return false;
  }

  updateChecklistState(props) {
    if (Object.keys(props.data).length > 0) {
      const isSelfPaced = props.data.is_self_paced;
      const hasCertificatesEnabled = props.data.certificates && props.data.certificates.is_enabled;
      const hasHighlightsEnabled = props.data.sections && props.data.sections.highlights_enabled;
      const checks = getFilteredChecklist(props.dataList,
        isSelfPaced, hasCertificatesEnabled, hasHighlightsEnabled);

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
            {this.getBody()}
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
        is_enabled: PropTypes.bool,
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
        assignments_with_dates_before_start: PropTypes.array,
        assignments_with_dates_after_end: PropTypes.array,
        assignments_with_ora_dates_before_start: PropTypes.array,
        assignments_with_ora_dates_after_end: PropTypes.array,
      }),
      dates: PropTypes.shape({
        has_start_date: PropTypes.bool,
        has_end_date: PropTypes.bool,
      }),
      updates: PropTypes.shape({
        has_update: PropTypes.bool,
      }),
      certificates: PropTypes.shape({
        is_enabled: PropTypes.bool,
        is_activated: PropTypes.bool,
        has_certificate: PropTypes.bool,
      }),
      grades: PropTypes.shape({
        has_grading_policy: PropTypes.bool,
        sum_of_weights: PropTypes.number,
      }),
      is_self_paced: PropTypes.bool,
    }).isRequired,
  ]).isRequired,
  dataHeading: elementType(WrappedMessage).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  dataList: PropTypes.arrayOf(PropTypes.object).isRequired,
  idPrefix: PropTypes.string.isRequired,
  studioDetails: PropTypes.shape({
    course: PropTypes.shape({
      base_url: PropTypes.string,
      course_release_date: PropTypes.string,
      display_course_number: PropTypes.string,
      enable_quality: PropTypes.bool,
      id: PropTypes.string,
      is_course_self_paced: PropTypes.boolean,
      lang: PropTypes.string,
      name: PropTypes.string,
      num: PropTypes.string,
      org: PropTypes.string,
      revision: PropTypes.string,
      url_name: PropTypes.string,
    }),
    enable_quality: PropTypes.boolean,
    help_tokens: PropTypes.objectOf(PropTypes.string),
    lang: PropTypes.string,
    links: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
  isLoading: PropTypes.bool,
};

CourseChecklist.defaultProps = {
  isLoading: false,
};
