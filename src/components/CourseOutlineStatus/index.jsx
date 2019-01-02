import classNames from 'classnames';
import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';
import { Hyperlink, Icon } from '@edx/paragon';
import React from 'react';
import PropTypes from 'prop-types';

import { checklistLoading } from '../../data/constants/loadingTypes';
import CourseOutlineStatusLabel from '../CourseOutlineStatusLabel';
import CourseOutlineStatusValue from '../CourseOutlineStatusValue';
import getFilteredChecklist from '../../utils/CourseChecklist/getFilteredChecklist';
import getValidatedValue from '../../utils/CourseChecklist/getValidatedValue';
import { launchChecklist, bestPracticesChecklist } from '../../utils/CourseChecklist/courseChecklistData';
import messages from './displayMessages';
import styles from './CourseOutlineStatus.scss';
import { trackEvent } from '../../utils/analytics';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';

export default class CourseOutlineStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      completedCourseBestPracticesChecks: 0,
      completedCourseLaunchChecks: 0,
      totalCourseBestPracticesChecks: 0,
      totalCourseLaunchChecks: 0,
    };

    this.spinnerClasses = [FontAwesomeStyles.fa, FontAwesomeStyles['fa-spinner'], FontAwesomeStyles['fa-spin']];
    this.onCourseChecklistHyperlinkClick = this.onCourseChecklistHyperlinkClick.bind(this);
  }

  componentWillMount() {
    const isSelfPaceCourse = this.props.studioDetails.course.is_course_self_paced;
    const hasCertificatesEnabled = false;
    const hasHighlightsEnabled = false;
    this.setState({
      totalCourseBestPracticesChecks: getFilteredChecklist(bestPracticesChecklist.data,
        isSelfPaceCourse, hasCertificatesEnabled, hasHighlightsEnabled).length,
      totalCourseLaunchChecks: getFilteredChecklist(launchChecklist.data,
        isSelfPaceCourse, hasCertificatesEnabled, hasHighlightsEnabled).length,
    });
  }

  componentDidMount() {
    if (this.props.studioDetails.enable_quality) {
      this.props.getCourseBestPractices(
        { exclude_graded: true },
        this.props.studioDetails.course,
      );
    }
    this.props.getCourseLaunch({ graded_only: true }, this.props.studioDetails.course);
  }

  componentWillReceiveProps(nextProps) {
    const courseData = {
      isSelfPaced: false,
      hasCertificatesEnabled: false,
      hasHighlightsEnabled: false,
    };
    if (Object.keys(nextProps.courseLaunchData).length > 0) {
      courseData.isSelfPaced = nextProps.courseLaunchData.is_self_paced;
      courseData.hasCertificatesEnabled = nextProps.courseLaunchData.certificates.is_enabled;
      const filteredCourseLaunchChecks = getFilteredChecklist(launchChecklist.data,
        courseData.isSelfPaced, courseData.hasCertificatesEnabled, courseData.hasHighlightsEnabled);

      let completedCourseLaunchChecks = 0;

      const props = {
        data: nextProps.courseLaunchData,
      };

      filteredCourseLaunchChecks.forEach((check) => {
        const value = getValidatedValue(props, check.id);

        if (value) {
          completedCourseLaunchChecks += 1;
        }
      });

      this.setState({
        completedCourseLaunchChecks,
        totalCourseLaunchChecks: filteredCourseLaunchChecks.length,
      });
    }

    if (Object.keys(nextProps.courseBestPracticesData).length > 0
      && nextProps.studioDetails.enable_quality) {
      courseData.hasHighlightsEnabled =
        nextProps.courseBestPracticesData.sections.highlights_enabled;
      const filteredCourseBestPracticesChecks = getFilteredChecklist(bestPracticesChecklist.data,
        courseData.isSelfPaced, courseData.hasCertificatesEnabled, courseData.hasHighlightsEnabled);

      let completedCourseBestPracticesChecks = 0;

      const props = {
        data: nextProps.courseBestPracticesData,
      };

      filteredCourseBestPracticesChecks.forEach((check) => {
        const value = getValidatedValue(props, check.id);

        if (value) {
          completedCourseBestPracticesChecks += 1;
        }
      });

      this.setState({
        completedCourseBestPracticesChecks,
        totalCourseBestPracticesChecks: filteredCourseBestPracticesChecks.length,
      });
    }
  }

  onCourseChecklistHyperlinkClick = () => {
    trackEvent(
      'edx.bi.studio.course.checklist.accessed', {
        category: 'click',
        event_type: 'outline-access',
        label: this.props.studioDetails.course.id,
      },
    );
  };

  getCourseStartDateStatus = () => {
    const columnClassName = this.doesCourseHaveReleaseDate() ? 'col-5' : 'col';

    return (<div className={classNames(columnClassName)}>
      <div className="no-gutters row">
        <div className="col">
          <CourseOutlineStatusLabel>
            <WrappedMessage message={messages.startDateStatusLabel} />
          </CourseOutlineStatusLabel>
          <CourseOutlineStatusValue>
            <Hyperlink
              className={classNames(
                styles['status-link'],
              )}
              content={this.props.studioDetails.course.course_release_date}
              destination={`${this.props.studioDetails.links.settings}#schedule`}
            />
          </CourseOutlineStatusValue>
        </div>
      </div>
    </div>);
  };

  getCoursePacingTypeValue = () => (
    this.props.studioDetails.course.is_course_self_paced ?
      <WrappedMessage message={messages.pacingTypeSelfPaced} /> :
      <WrappedMessage message={messages.pacingTypeInstructorPaced} />
  );

  getCoursePacingTypeStatus = () => (
    <div className={classNames('col')}>
      <CourseOutlineStatusLabel>
        <WrappedMessage message={messages.pacingTypeStatusLabel} />
      </CourseOutlineStatusLabel>
      <CourseOutlineStatusValue>
        {this.getCoursePacingTypeValue()}
      </CourseOutlineStatusValue>
    </div>
  );

  getCourseChecklistStatus = () => (

    <div className={classNames('col')}>
      <CourseOutlineStatusLabel>
        <WrappedMessage message={messages.checklistsStatusLabel} />
      </CourseOutlineStatusLabel>
      <CourseOutlineStatusValue>
        {this.getCourseChecklistValue()}
      </CourseOutlineStatusValue>
    </div>
  );

  getCourseChecklistValue = () => (
    this.isLoading() ?
      this.getLoadingIcon() :
      this.getCourseChecklistHyperlink()
  );

  getLoadingIcon = () => (
    <WrappedMessage message={messages.loadingIconLabel}>
      {displayText =>
        (<div className="ml-5">
          <Icon
            className={[classNames(...this.spinnerClasses)]}
            screenReaderText={displayText}
          />
        </div>)
      }
    </WrappedMessage>
  );

  getCourseChecklistHyperlink = () => {
    const {
      completedCourseBestPracticesChecks,
      completedCourseLaunchChecks,
      totalCourseBestPracticesChecks,
      totalCourseLaunchChecks,
    } = this.state;

    const totalCompletedChecks = this.props.studioDetails.enable_quality ?
      completedCourseBestPracticesChecks + completedCourseLaunchChecks :
      completedCourseLaunchChecks;

    const totalChecks = this.props.studioDetails.enable_quality ?
      totalCourseBestPracticesChecks + totalCourseLaunchChecks :
      totalCourseLaunchChecks;

    return (
      <Hyperlink
        className={classNames(styles['status-link'])}
        content={
          <WrappedMessage
            message={messages.completionCountLabel}
            values={{ completed: totalCompletedChecks, total: totalChecks }}
          >
            {displayText =>
              (<span>
                {displayText}
              </span>)
            }
          </WrappedMessage>
        }
        destination={`/checklists/${this.props.studioDetails.course.id}`}
        onClick={this.onCourseChecklistHyperlinkClick}
      />
    );
  };

  getAriaLiveRegion = () => {
    const message =
      this.isLoading() ?
        <WrappedMessage message={messages.checklistStatusLoadingLabel} /> :
        <WrappedMessage message={messages.checklistStatusDoneLoadingLabel} />;

    return (
      <div className="sr-only" aria-live="polite" role="status">
        {message}
      </div>
    );
  }

  isLoading = () => (
    this.props.loadingChecklists.includes(checklistLoading.COURSE_BEST_PRACTICES) ||
    this.props.loadingChecklists.includes(checklistLoading.COURSE_LAUNCH)
  );
  doesCourseHaveReleaseDate = () => (this.props.studioDetails.course.course_release_date !== 'Set Date');

  render() {
    return (
      <React.Fragment>
        {this.getAriaLiveRegion()}
        <div className="row no-gutters">
          {this.getCourseStartDateStatus()}
          {this.getCoursePacingTypeStatus()}
          {this.getCourseChecklistStatus()}
        </div>
      </React.Fragment>
    );
  }
}

CourseOutlineStatus.propTypes = {
  courseBestPracticesData: PropTypes.shape({
    sections: PropTypes.shape({
      number_with_highlights: PropTypes.number,
      total_visible: PropTypes.number,
      total_number: PropTypes.number,
      highlights_enabled: PropTypes.bool,
      highlights_active_for_course: PropTypes.bool,
    }),
    subsections: PropTypes.object,
    units: PropTypes.object,
    videos: PropTypes.object,
    is_self_paced: PropTypes.bool,
  }).isRequired,
  courseLaunchData: PropTypes.shape({
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
      has_grading_policy: PropTypes.bool,
      sum_of_weights: PropTypes.number,
    }),
    is_self_paced: PropTypes.bool,
  }).isRequired,
  getCourseBestPractices: PropTypes.func.isRequired,
  getCourseLaunch: PropTypes.func.isRequired,
  loadingChecklists: PropTypes.arrayOf(PropTypes.string),
  studioDetails: PropTypes.shape({
    course: PropTypes.shape({
      base_url: PropTypes.string,
      course_release_date: PropTypes.string,
      display_course_number: PropTypes.string,
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
    links: PropTypes.objectOf(PropTypes.string).isRequired,
  }).isRequired,
};

CourseOutlineStatus.defaultProps = {
  loadingChecklists: [],
};
