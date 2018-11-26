import { Hyperlink, Icon } from '@edx/paragon';
import { IntlProvider, FormattedMessage } from 'react-intl';
import React from 'react';

import { checklistLoading } from '../../data/constants/loadingTypes';
import { courseDetails } from '../../utils/testConstants';
import CourseOutlineStatus from './';
import CourseOutlineStatusLabel from '../CourseOutlineStatusLabel';
import CourseOutlineStatusValue from '../CourseOutlineStatusValue';
import getFilteredChecklist from '../../utils/CourseChecklist/getFilteredChecklist';
import getValidatedValue from '../../utils/CourseChecklist/getValidatedValue';
import { launchChecklist, bestPracticesChecklist } from '../../utils/CourseChecklist/courseChecklistData';
import messages from './displayMessages';
import { shallowWithIntl } from '../../utils/i18n/enzymeHelper';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';

// generating test checklist to avoid relying on actual data
const testChecklistData = ['a', 'b', 'c', 'd'].reduce(((accumulator, currentValue) => {
  accumulator.push({
    id: currentValue,
    shortDescription: currentValue,
    longDescription: currentValue,
  });
  return accumulator;
}), []);
const testChecklist = {
  heading: 'test',
  data: testChecklistData,
  sections: { highlights_enabled: true },
};
const testCourseLaunchData = {
  certificates: { is_enabled: true },
};

/**
 * generating test validated values to mock the implementation
 * of the getValidatedValue utility function
 */
const launchChecklistValidatedValues = {};
const bestPracticesChecklistValidatedValues = {};
let i;

for (i = 0; i < Math.round(launchChecklist.data.length / 2); i += 1) {
  launchChecklistValidatedValues[launchChecklist.data[i].id] = true;
}

for (i = Math.round(launchChecklist.data.length / 2); i < launchChecklist.data.length; i += 1) {
  launchChecklistValidatedValues[launchChecklist.data[i].id] = false;
}

for (i = 0; i < Math.round(bestPracticesChecklist.data.length / 2); i += 1) {
  bestPracticesChecklistValidatedValues[bestPracticesChecklist.data[i].id] = true;
}

for (i = Math.round(bestPracticesChecklist.data.length / 2);
  i < bestPracticesChecklist.data.length;
  i += 1) {
  bestPracticesChecklistValidatedValues[bestPracticesChecklist.data[i].id] = false;
}

const validatedValues = {
  ...launchChecklistValidatedValues,
  ...bestPracticesChecklistValidatedValues,
};

// mock utility functions
jest.mock('../../utils/CourseChecklist/getValidatedValue');
jest.mock('../../utils/CourseChecklist/getFilteredChecklist');

getValidatedValue.mockImplementation(
  (props, id) => (validatedValues[id]),
);

getFilteredChecklist.mockImplementation(
  dataList => (dataList),
);

const intlProvider = new IntlProvider({ locale: 'en', messages: {} }, {});
const { intl } = intlProvider.getChildContext();

global.analytics = {
  track: () => { },
};

let wrapper;

const defaultProps = {
  studioDetails: {
    course: courseDetails,
    enable_quality: true,
    links: {
      settings: 'settingsTest',
    },
  },
  getCourseBestPractices: () => { },
  getCourseLaunch: () => { },
  courseBestPracticesData: {},
  courseLaunchData: {},
};

describe('CourseOutlineStatus', () => {
  describe('renders', () => {
    describe('a Start Date CourseOutlineStatusBlock component with', () => {
      wrapper = shallowWithIntl(<CourseOutlineStatus {...defaultProps} />);

      it('a label', () => {
        const label = wrapper.find(CourseOutlineStatusLabel).at(0);
        expect(label.children()).toHaveLength(1);

        const message = label.childAt(0).find(WrappedMessage);
        expect(message.prop('message')).toEqual(messages.startDateStatusLabel);
      });

      it('a value', () => {
        const value = wrapper.find(CourseOutlineStatusValue).at(0);
        expect(value.children()).toHaveLength(1);

        const link = value.childAt(0).find(Hyperlink);

        expect(link).toHaveLength(1);
        expect(link.prop('className')).toEqual(expect.stringContaining('status-link'));
        expect(link.prop('content')).toEqual(courseDetails.course_release_date);
        expect(link.prop('destination')).toEqual(`${defaultProps.studioDetails.links.settings}#schedule`);
      });
    });

    describe('a Pacing Type CourseOutlineStatusBlock component with', () => {
      wrapper = shallowWithIntl(<CourseOutlineStatus {...defaultProps} />);

      it('a label', () => {
        const label = wrapper.find(CourseOutlineStatusLabel).at(1);
        expect(label.children()).toHaveLength(1);

        const message = label.childAt(0).find(WrappedMessage);
        expect(message.prop('message')).toEqual(messages.pacingTypeStatusLabel);
      });

      describe('a value with', () => {
        it('a value when pacing type is self paced', () => {
          const newCourseDetails = {
            ...courseDetails,
            is_course_self_paced: true,
          };

          const newStudioDetails = {
            ...defaultProps.studioDetails,
            course: newCourseDetails,
          };

          wrapper.setProps({
            studioDetails: newStudioDetails,
          });

          const value = wrapper.find(CourseOutlineStatusValue).at(1);
          expect(value.children()).toHaveLength(1);

          const message = value.childAt(0).find(WrappedMessage);
          expect(message.prop('message')).toEqual(messages.pacingTypeSelfPaced);
        });

        it('a value when pacing type is instructor paced', () => {
          const newCourseDetails = {
            ...courseDetails,
            is_course_self_paced: false,
          };

          const newStudioDetails = {
            ...defaultProps.studioDetails,
            ...newCourseDetails,
          };

          wrapper.setProps({
            studioDetails: newStudioDetails,
          });

          const value = wrapper.find(CourseOutlineStatusValue).at(1);
          expect(value.children()).toHaveLength(1);

          const message = value.childAt(0).find(WrappedMessage);
          expect(message.prop('message')).toEqual(messages.pacingTypeInstructorPaced);
        });
      });
    });

    describe('a Checklists CourseOutlineStatusBlock component with', () => {
      wrapper = shallowWithIntl(<CourseOutlineStatus {...defaultProps} />);

      it('a label', () => {
        const label = wrapper.find(CourseOutlineStatusLabel).at(2);
        expect(label.children()).toHaveLength(1);

        const message = label.childAt(0).find(WrappedMessage);
        expect(message.prop('message')).toEqual(messages.checklistsStatusLabel);
      });

      it('a value', () => {
        const value = wrapper.find(CourseOutlineStatusValue).at(2);
        expect(value.children()).toHaveLength(1);

        const link = value.childAt(0);

        expect(link).toHaveLength(1);
        expect(link.prop('className')).toEqual(expect.stringContaining('status-link'));
        expect(link.prop('destination')).toEqual(`/checklists/${defaultProps.studioDetails.course.id}`);

        const content = shallowWithIntl(link.prop('content'));
        expect(content.prop('message')).toEqual(messages.completionCountLabel);
        expect(content.prop('values')).toEqual({ completed: 0, total: 10 });
      });
    });

    describe('loading icons with', () => {
      it('a loading icon instead of link when course launch is loading', () => {
        wrapper = shallowWithIntl(<CourseOutlineStatus {...defaultProps} />);

        wrapper.setProps({
          loadingChecklists: [checklistLoading.COURSE_LAUNCH],
        });
        const value = wrapper.find(CourseOutlineStatusValue).at(2);

        const link = value.find(Hyperlink);
        expect(link).toHaveLength(0);

        const loadingIconSection = value.find(WrappedMessage);
        expect(loadingIconSection).toHaveLength(1);

        const loadingIcon = loadingIconSection.dive({ context: { intl } })
          .dive({ context: { intl } })
          .find(FormattedMessage)
          .dive({ context: { intl } })
          .find(Icon);

        expect(loadingIcon.prop('className')[0]).toEqual(expect.stringContaining('fa-spinner'));
        expect(loadingIcon.prop('className')[0]).toEqual(expect.stringContaining('fa-spin'));
        expect(loadingIcon.prop('screenReaderText')).toEqual(messages.loadingIconLabel.defaultMessage);
      });

      it('a loading icon instead of a link when course best practices is loading', () => {
        wrapper = shallowWithIntl(<CourseOutlineStatus {...defaultProps} />);

        wrapper.setProps({
          loadingChecklists: [checklistLoading.COURSE_BEST_PRACTICES],
        });

        const value = wrapper.find(CourseOutlineStatusValue).at(2);

        const link = value.find(Hyperlink);
        expect(link).toHaveLength(0);

        const loadingIconSection = value.find(WrappedMessage);
        expect(loadingIconSection).toHaveLength(1);

        const loadingIcon = loadingIconSection.dive({ context: { intl } })
          .dive({ context: { intl } })
          .find(FormattedMessage)
          .dive({ context: { intl } })
          .find(Icon);

        expect(loadingIcon.prop('className')[0]).toEqual(expect.stringContaining('fa-spinner'));
        expect(loadingIcon.prop('className')[0]).toEqual(expect.stringContaining('fa-spin'));
        expect(loadingIcon.prop('screenReaderText')).toEqual(messages.loadingIconLabel.defaultMessage);
      });

      it('a loading icon instead of a link when both course launch and course best practices are loading', () => {
        wrapper = shallowWithIntl(<CourseOutlineStatus {...defaultProps} />);

        wrapper.setProps({
          loadingChecklists: [
            checklistLoading.COURSE_BEST_PRACTICES,
            checklistLoading.COURSE_LAUNCH,
          ],
        });

        const value = wrapper.find(CourseOutlineStatusValue).at(2);

        const link = value.find(Hyperlink);
        expect(link).toHaveLength(0);

        const loadingIconSection = value.find(WrappedMessage);
        expect(loadingIconSection).toHaveLength(1);

        const loadingIcon = loadingIconSection.dive({ context: { intl } })
          .dive({ context: { intl } })
          .find(FormattedMessage)
          .dive({ context: { intl } })
          .find(Icon);

        expect(loadingIcon.prop('className')[0]).toEqual(expect.stringContaining('fa-spinner'));
        expect(loadingIcon.prop('className')[0]).toEqual(expect.stringContaining('fa-spin'));
        expect(loadingIcon.prop('screenReaderText')).toEqual(messages.loadingIconLabel.defaultMessage);
      });
    });

    describe('an aria-live region with', () => {
      it('an aria-live region', () => {
        wrapper = shallowWithIntl(<CourseOutlineStatus {...defaultProps} />);

        const ariaLiveRegion = wrapper.find({ 'aria-live': 'polite' });

        expect(ariaLiveRegion).toHaveLength(1);
        expect(ariaLiveRegion.prop('className')).toEqual(expect.stringContaining('sr-only'));
        expect(ariaLiveRegion.prop('role')).toEqual(expect.stringContaining('status'));
      });

      it('correct content when checklists are loading', () => {
        wrapper = shallowWithIntl(<CourseOutlineStatus {...defaultProps} />);

        wrapper.setProps({
          loadingChecklists: [
            checklistLoading.COURSE_BEST_PRACTICES,
            checklistLoading.COURSE_LAUNCH,
          ],
        });

        const ariaLiveRegion = wrapper.find({ 'aria-live': 'polite' });

        expect(ariaLiveRegion.children()).toHaveLength(1);
        expect(ariaLiveRegion.childAt(0).find(WrappedMessage).prop('message')).toEqual(messages.checklistStatusLoadingLabel);
      });

      it('correct content when checklists are done loading', () => {
        wrapper = shallowWithIntl(<CourseOutlineStatus {...defaultProps} />);

        wrapper.setProps({
          loadingChecklists: [],
        });

        const ariaLiveRegion = wrapper.find({ 'aria-live': 'polite' });

        expect(ariaLiveRegion.children()).toHaveLength(1);
        expect(ariaLiveRegion.childAt(0).find(WrappedMessage).prop('message')).toEqual(messages.checklistStatusDoneLoadingLabel);
      });
    });

    describe('if enable_quality prop is true', () => {
      it('completion count text', () => {
        wrapper = shallowWithIntl(<CourseOutlineStatus {...defaultProps} />);

        // multiplied by two because of two checklists
        const completed = Object.values(validatedValues).filter(value => value).length;
        const total = Object.values(validatedValues).length;

        wrapper.setProps({
          courseBestPracticesData: testChecklist,
          courseLaunchData: testCourseLaunchData,
        });

        const checklistsLink = wrapper.find(CourseOutlineStatusValue).at(2).find(Hyperlink);
        const checklistsLinkContent = shallowWithIntl(checklistsLink.prop('content'), { context: { intl } });
        const completionCount = checklistsLinkContent.dive({ context: { intl } })
          .find(FormattedMessage).dive({ context: { intl } });

        expect(completionCount.text()).toEqual(`${completed}/${total} completed`);
      });
    });

    describe('if enable_quality prop is false', () => {
      it('completion count text', () => {
        const newStudioDetails = {
          ...defaultProps.studioDetails,
          enable_quality: false,
        };

        const newProps = {
          ...defaultProps,
          studioDetails: newStudioDetails,
        };

        wrapper = shallowWithIntl(<CourseOutlineStatus {...newProps} />);

        const completed = Object.values(launchChecklistValidatedValues)
          .filter(value => value).length;
        const total = Object.values(launchChecklistValidatedValues).length;

        wrapper.setProps({
          courseBestPracticesData: testChecklist,
          courseLaunchData: testCourseLaunchData,
        });

        const checklistsLink = wrapper.find(CourseOutlineStatusValue).at(2).find(Hyperlink);
        const checklistsLinkContent = shallowWithIntl(checklistsLink.prop('content'), { context: { intl } });
        const completionCount = checklistsLinkContent.dive({ context: { intl } })
          .find(FormattedMessage).dive({ context: { intl } });

        expect(completionCount.text()).toEqual(`${completed}/${total} completed`);
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

      wrapper = shallowWithIntl(<CourseOutlineStatus {...props} />);

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

      wrapper = shallowWithIntl(<CourseOutlineStatus {...props} />);

      expect(getCourseValidationSpy).toHaveBeenCalledTimes(1);
      expect(getCourseValidationSpy).toHaveBeenCalledWith(
        { graded_only: true },
        defaultProps.studioDetails.course,
      );
    });

    it('calls trackEvent when checklist link is clicked', () => {
      wrapper = shallowWithIntl(<CourseOutlineStatus {...defaultProps} />);

      const checklistsLink = wrapper.find(CourseOutlineStatusValue).at(2).find(Hyperlink);

      const trackEventSpy = jest.fn();
      global.analytics.track = trackEventSpy;

      checklistsLink.simulate('click');
      expect(trackEventSpy).toHaveBeenCalledTimes(1);
    });
  });
});
