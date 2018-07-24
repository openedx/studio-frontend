import classNames from 'classnames';
import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';
import { Hyperlink, Icon } from '@edx/paragon';
import React from 'react';
import PropTypes from 'prop-types';

import { checklistLoading } from '../../data/constants/loadingTypes';
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
  }

  componentWillMount() {
    this.setState({
      totalCourseBestPracticesChecks: getFilteredChecklist(bestPracticesChecklist.data,
        this.props.studioDetails.course.is_course_self_paced).length,
      totalCourseLaunchChecks: getFilteredChecklist(launchChecklist.data,
        this.props.studioDetails.course.is_course_self_paced).length,
    });
  }

  componentDidMount() {
    this.props.getCourseBestPractices({ exclude_graded: true }, this.props.studioDetails.course);
    this.props.getCourseLaunch({ graded_only: true }, this.props.studioDetails.course);
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.courseLaunchData).length > 0) {
      const checks = getFilteredChecklist(
        launchChecklist.data, nextProps.courseLaunchData.is_self_paced);

      let completedCourseLaunchChecks = 0;

      const props = {
        data: nextProps.courseLaunchData,
      };

      checks.forEach((check) => {
        const value = getValidatedValue(props, check.id);

        if (value) {
          completedCourseLaunchChecks += 1;
        }
      });

      this.setState({
        completedCourseLaunchChecks,
      });
    }

    if (Object.keys(nextProps.courseBestPracticesData).length > 0
      && nextProps.studioDetails.enable_quality) {
      const checks = getFilteredChecklist(
        bestPracticesChecklist.data, nextProps.courseBestPracticesData.is_self_paced);

      let completedCourseBestPracticesChecks = 0;

      const props = {
        data: nextProps.courseBestPracticesData,
      };

      checks.forEach((check) => {
        const value = getValidatedValue(props, check.id);

        if (value) {
          completedCourseBestPracticesChecks += 1;
        }
      });

      this.setState({
        completedCourseBestPracticesChecks,
      });
    }
  }

  getLoadingIcon = () => (
    <WrappedMessage message={messages.loadingIconLabel}>
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

  getHyperLink = () => {
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
        className={classNames(styles['text-info'], styles['status-checklist-value'])}
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
        onClick={() => trackEvent(
          'edx.bi.studio.course.checklist.accessed', {
            category: 'click',
            event_type: 'outline-access',
            label: this.props.studioDetails.course.id,
          },
        )}
      />
    );
  }

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

  getBody = () => (
    this.isLoading() ?
      this.getLoadingIcon() :
      this.getHyperLink()
  );

  isLoading = () => (
    this.props.loadingChecklists.includes(checklistLoading.COURSE_BEST_PRACTICES) ||
    this.props.loadingChecklists.includes(checklistLoading.COURSE_LAUNCH)
  );

  render() {
    return (
      <React.Fragment>
        <div className={styles['status-checklist']}>
          <h2 className={styles['status-checklist-label']}>
            <WrappedMessage message={messages.checklistLabel} />
          </h2>
          <div>
            {this.getAriaLiveRegion()}
            {this.getBody()}
          </div>
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
      is_activated: PropTypes.bool,
      has_certificate: PropTypes.bool,
    }),
    grades: PropTypes.shape({
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
  }).isRequired,
};

CourseOutlineStatus.defaultProps = {
  loadingChecklists: [],
};
