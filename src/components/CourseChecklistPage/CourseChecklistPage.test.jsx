import React from 'react';

import { checklistLoading } from '../../data/constants/loadingTypes';
import { courseDetails } from '../../utils/testConstants';
import CourseChecklistPage from '.';
import { launchChecklist, bestPracticesChecklist } from '../../utils/CourseChecklist/courseChecklistData';
import messages from './displayMessages';
import { shallowWithIntl } from '../../utils/i18n/enzymeHelper';
import WrappedCourseChecklist from '../CourseChecklist/container';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';

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
  getCourseBestPractices: () => { },
  getCourseLaunch: () => { },
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

      describe('an aria-live region with', () => {
        it('an aria-live region', () => {
          wrapper = shallowWithIntl(<CourseChecklistPage {...defaultProps} />);

          const ariaLiveRegion = wrapper.find({ 'aria-live': 'polite' });

          expect(ariaLiveRegion).toHaveLength(1);
          expect(ariaLiveRegion.prop('className')).toEqual(expect.stringContaining('sr-only'));
          expect(ariaLiveRegion.prop('role')).toEqual(expect.stringContaining('status'));
        });

        it('correct content when the launch checklist is loading', () => {
          wrapper = shallowWithIntl(<CourseChecklistPage {...defaultProps} />);

          wrapper.setProps({
            loadingChecklists: [
              checklistLoading.COURSE_LAUNCH,
            ],
          });

          const ariaLiveRegion = wrapper.find({ 'aria-live': 'polite' });

          expect(ariaLiveRegion.children()).toHaveLength(2);
          expect(ariaLiveRegion.childAt(0).find(WrappedMessage).prop('message')).toEqual(messages.launchChecklistLoadingLabel);
          expect(ariaLiveRegion.childAt(1).find(WrappedMessage).prop('message')).toEqual(messages.bestPracticesChecklistDoneLoadingLabel);
        });

        it('correct content when the best practices checklist is loading', () => {
          wrapper = shallowWithIntl(<CourseChecklistPage {...defaultProps} />);

          wrapper.setProps({
            loadingChecklists: [
              checklistLoading.COURSE_BEST_PRACTICES,
            ],
          });

          const ariaLiveRegion = wrapper.find({ 'aria-live': 'polite' });

          expect(ariaLiveRegion.children()).toHaveLength(2);
          expect(ariaLiveRegion.childAt(0).find(WrappedMessage).prop('message')).toEqual(messages.launchChecklistDoneLoadingLabel);
          expect(ariaLiveRegion.childAt(1).find(WrappedMessage).prop('message')).toEqual(messages.bestPracticesChecklistLoadingLabel);
        });

        it('correct content when both checklists are done loading', () => {
          wrapper = shallowWithIntl(<CourseChecklistPage {...defaultProps} />);

          wrapper.setProps({
            loadingChecklists: [],
          });

          const ariaLiveRegion = wrapper.find({ 'aria-live': 'polite' });

          expect(ariaLiveRegion.children()).toHaveLength(2);
          expect(ariaLiveRegion.childAt(0).find(WrappedMessage).prop('message')).toEqual(messages.launchChecklistDoneLoadingLabel);
          expect(ariaLiveRegion.childAt(1).find(WrappedMessage).prop('message')).toEqual(messages.bestPracticesChecklistDoneLoadingLabel);
        });
      });

      describe('a WrappedCourseChecklist component', () => {
        describe('for the launch checklist with', () => {
          it('correct props', () => {
            wrapper = shallowWithIntl(<CourseChecklistPage {...defaultProps} />);

            const checklist = wrapper.find(WrappedCourseChecklist).at(0);

            expect(checklist.prop('dataHeading')).toEqual(<WrappedMessage message={messages.launchChecklistLabel} />);
            expect(checklist.prop('dataList')).toEqual(launchChecklist.data);
            expect(checklist.prop('data')).toEqual(testCourseLaunchData);
            expect(checklist.prop('idPrefix')).toEqual('launchChecklist');
            expect(checklist.prop('isLoading')).toEqual(false);
          });

          it('isLoading prop set to true if launch checklist is loading', () => {
            wrapper = shallowWithIntl(<CourseChecklistPage {...defaultProps} />);

            wrapper.setProps({
              loadingChecklists: [checklistLoading.COURSE_LAUNCH],
            });

            const checklist = wrapper.find(WrappedCourseChecklist).at(0);
            expect(checklist.prop('isLoading')).toEqual(true);
          });
        });

        describe('for the best practices checklist checklist with', () => {
          it('correct props', () => {
            wrapper = shallowWithIntl(<CourseChecklistPage {...defaultProps} />);

            const checklist = wrapper.find(WrappedCourseChecklist).at(1);

            expect(checklist.prop('dataHeading')).toEqual(<WrappedMessage message={messages.bestPracticesChecklistLabel} />);
            expect(checklist.prop('dataList')).toEqual(bestPracticesChecklist.data);
            expect(checklist.prop('data')).toEqual(testCourseBestPracticesData);
            expect(checklist.prop('idPrefix')).toEqual('bestPracticesChecklist');
            expect(checklist.prop('isLoading')).toEqual(false);
          });

          it('isLoading prop set to true if best practices checklist is loading', () => {
            wrapper = shallowWithIntl(<CourseChecklistPage {...defaultProps} />);

            wrapper.setProps({
              loadingChecklists: [checklistLoading.COURSE_BEST_PRACTICES],
            });

            const checklist = wrapper.find(WrappedCourseChecklist).at(1);
            expect(checklist.prop('isLoading')).toEqual(true);
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

      describe('an aria-live region with', () => {
        it('an aria-live region', () => {
          wrapper = shallowWithIntl(<CourseChecklistPage {...newProps} />);

          const ariaLiveRegion = wrapper.find({ 'aria-live': 'polite' });

          expect(ariaLiveRegion).toHaveLength(1);
          expect(ariaLiveRegion.prop('className')).toEqual(expect.stringContaining('sr-only'));
          expect(ariaLiveRegion.prop('role')).toEqual(expect.stringContaining('status'));
        });

        it('correct content when the launch checklist is loading', () => {
          wrapper = shallowWithIntl(<CourseChecklistPage {...newProps} />);

          wrapper.setProps({
            loadingChecklists: [
              checklistLoading.COURSE_LAUNCH,
            ],
          });

          const ariaLiveRegion = wrapper.find({ 'aria-live': 'polite' });

          expect(ariaLiveRegion.children()).toHaveLength(1);
          expect(ariaLiveRegion.childAt(0).find(WrappedMessage).prop('message')).toEqual(messages.launchChecklistLoadingLabel);
        });

        it('correct content when the best practices checklist is loading', () => {
          wrapper = shallowWithIntl(<CourseChecklistPage {...newProps} />);

          wrapper.setProps({
            loadingChecklists: [
              checklistLoading.COURSE_BEST_PRACTICES,
            ],
          });

          const ariaLiveRegion = wrapper.find({ 'aria-live': 'polite' });

          expect(ariaLiveRegion.children()).toHaveLength(1);
          expect(ariaLiveRegion.childAt(0).find(WrappedMessage).prop('message')).toEqual(messages.launchChecklistDoneLoadingLabel);
        });

        it('correct content when both checklists are done loading', () => {
          wrapper = shallowWithIntl(<CourseChecklistPage {...newProps} />);

          wrapper.setProps({
            loadingChecklists: [],
          });

          const ariaLiveRegion = wrapper.find({ 'aria-live': 'polite' });

          expect(ariaLiveRegion.children()).toHaveLength(1);
          expect(ariaLiveRegion.childAt(0).find(WrappedMessage).prop('message')).toEqual(messages.launchChecklistDoneLoadingLabel);
        });
      });

      describe('a WrappedCourseChecklist component', () => {
        describe('for the launch checklist with', () => {
          it('correct props', () => {
            wrapper = shallowWithIntl(<CourseChecklistPage {...newProps} />);

            const checklist = wrapper.find(WrappedCourseChecklist).at(0);

            expect(checklist.prop('dataHeading')).toEqual(<WrappedMessage message={messages.launchChecklistLabel} />);
            expect(checklist.prop('dataList')).toEqual(launchChecklist.data);
            expect(checklist.prop('data')).toEqual(testCourseLaunchData);
            expect(checklist.prop('idPrefix')).toEqual('launchChecklist');
            expect(checklist.prop('isLoading')).toEqual(false);
          });

          it('isLoading prop set to true if launch checklist is loading', () => {
            wrapper = shallowWithIntl(<CourseChecklistPage {...newProps} />);

            wrapper.setProps({
              loadingChecklists: [checklistLoading.COURSE_LAUNCH],
            });

            const checklist = wrapper.find(WrappedCourseChecklist).at(0);
            expect(checklist.prop('isLoading')).toEqual(true);
          });
        });
      });
    });
  });

  describe('behaves', () => {
    it('calls getCourseBestPractices prop on mount', () => {
      const getCourseBestPracticesSpy = jest.fn();

      const props = {
        ...defaultProps,
        getCourseBestPractices: getCourseBestPracticesSpy,
      };

      wrapper = shallowWithIntl(<CourseChecklistPage {...props} />);

      expect(getCourseBestPracticesSpy).toHaveBeenCalledTimes(1);
      expect(getCourseBestPracticesSpy).toHaveBeenCalledWith(
        { exclude_graded: true },
        defaultProps.studioDetails.course,
      );
    });

    it('calls getCourseLaunch prop on mount', () => {
      const getCourseValidationSpy = jest.fn();

      const props = {
        ...defaultProps,
        getCourseLaunch: getCourseValidationSpy,
      };

      wrapper = shallowWithIntl(<CourseChecklistPage {...props} />);

      expect(getCourseValidationSpy).toHaveBeenCalledTimes(1);
      expect(getCourseValidationSpy).toHaveBeenCalledWith(
        { graded_only: true, validate_oras: true },
        defaultProps.studioDetails.course,
      );
    });
  });
});
