import React from 'react';

import { courseDetails } from '../../utils/testConstants';
import CourseChecklistPage from '.';
import { launchChecklist, bestPracticesChecklist } from '../../utils/CourseChecklist/courseChecklistData';
import { shallowWithIntl } from '../../utils/i18n/enzymeHelper';
import WrappedCourseChecklist from '../CourseChecklist/container';

let wrapper;

const testCourseBestPracticesData = {
  data: {
    courseBestPractices: 'courseBestPractices',
  },
};

const testCourseLaunchData = {
  data: {
    courseLaunch: 'courseLaunch',
  },
};

const defaultProps = {
  studioDetails: { ...courseDetails, enable_quality: true },
  getCourseQuality: () => { },
  getCourseValidation: () => { },
  courseBestPracticesData: testCourseBestPracticesData,
  courseLaunchData: testCourseLaunchData,
  enable_quality: true,
};

describe('CourseChecklistPage', () => {
  describe('renders', () => {
    describe('if enable_quality prop is true', () => {
      it('two WrappedCourseChecklist components ', () => {
        wrapper = shallowWithIntl(<CourseChecklistPage {...defaultProps} />);

        expect(wrapper.find(WrappedCourseChecklist)).toHaveLength(2);
      });

      describe('a WrappedCourseChecklist component', () => {
        describe('for the launch checklist with', () => {
          it('correct props', () => {
            wrapper = shallowWithIntl(<CourseChecklistPage {...defaultProps} />);

            const checklist = wrapper.find(WrappedCourseChecklist).at(0);

            expect(checklist.prop('dataHeading')).toEqual(launchChecklist.heading);
            expect(checklist.prop('dataList')).toEqual(launchChecklist.data);
            expect(checklist.prop('data')).toEqual(testCourseLaunchData);
          });
        });

        describe('for the quality checklist with', () => {
          it('correct props', () => {
            wrapper = shallowWithIntl(<CourseChecklistPage {...defaultProps} />);

            const checklist = wrapper.find(WrappedCourseChecklist).at(1);

            expect(checklist.prop('dataHeading')).toEqual(bestPracticesChecklist.heading);
            expect(checklist.prop('dataList')).toEqual(bestPracticesChecklist.data);
            expect(checklist.prop('data')).toEqual(testCourseBestPracticesData);
          });
        });
      });
    });

    describe('if enable_quality prop is false', () => {
      const newStudioDetails = {
        ...courseDetails,
        enable_quality: false,
      };

      const newProps = {
        ...defaultProps,
        studioDetails: newStudioDetails,
      };

      it('one WrappedCourseChecklist component if enable_quality prop is false', () => {
        wrapper = shallowWithIntl(<CourseChecklistPage {...newProps} />);

        expect(wrapper.find(WrappedCourseChecklist)).toHaveLength(1);
      });

      describe('a WrappedCourseChecklist component', () => {
        describe('for the launch checklist with', () => {
          it('correct props', () => {
            wrapper = shallowWithIntl(<CourseChecklistPage {...defaultProps} />);

            const checklist = wrapper.find(WrappedCourseChecklist).at(0);

            expect(checklist.prop('dataHeading')).toEqual(launchChecklist.heading);
            expect(checklist.prop('dataList')).toEqual(launchChecklist.data);
            expect(checklist.prop('data')).toEqual(testCourseLaunchData);
          });
        });
      });
    });
  });

  describe('behaves', () => {
    it('calls getCourseQuality prop on mount', () => {
      const getCourseQualitySpy = jest.fn();

      const props = {
        ...defaultProps,
        getCourseQuality: getCourseQualitySpy,
      };

      wrapper = shallowWithIntl(<CourseChecklistPage {...props} />);

      expect(getCourseQualitySpy).toHaveBeenCalledTimes(1);
      expect(getCourseQualitySpy).toHaveBeenCalledWith(
        { exclude_graded: true },
        defaultProps.studioDetails.course,
      );
    });

    it('calls getCourseValidation prop on mount', () => {
      const getCourseValidationSpy = jest.fn();

      const props = {
        ...defaultProps,
        getCourseValidation: getCourseValidationSpy,
      };

      wrapper = shallowWithIntl(<CourseChecklistPage {...props} />);

      expect(getCourseValidationSpy).toHaveBeenCalledTimes(1);
      expect(getCourseValidationSpy).toHaveBeenCalledWith(
        {},
        defaultProps.studioDetails.course,
      );
    });
  });
});
