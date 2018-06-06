import React from 'react';
import PropTypes from 'prop-types';

import { launchChecklist, bestPracticesChecklist } from '../../utils/CourseChecklist/courseChecklistData';
import WrappedCourseChecklist from '../CourseChecklist/container';

export default class CourseChecklistPage extends React.Component {
  componentDidMount() {
    this.props.getCourseQuality({ exclude_graded: true }, this.props.studioDetails.course);
    this.props.getCourseValidation({}, this.props.studioDetails.course);
  }

  render() {
    const courseBestPracticesChecklist = (
      <WrappedCourseChecklist
        dataHeading={bestPracticesChecklist.heading}
        dataList={bestPracticesChecklist.data}
        data={this.props.courseBestPracticesData}
      />
    );

    return (
      <React.Fragment>
        <WrappedCourseChecklist
          dataHeading={launchChecklist.heading}
          dataList={launchChecklist.data}
          data={this.props.courseLaunchData}
        />
        {
          this.props.studioDetails.enable_quality ? courseBestPracticesChecklist : null
        }
      </React.Fragment>
    );
  }
}

CourseChecklistPage.propTypes = {
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
  getCourseQuality: PropTypes.func.isRequired,
  getCourseValidation: PropTypes.func.isRequired,
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
};
