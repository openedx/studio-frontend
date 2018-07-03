import { Hyperlink } from '@edx/paragon';
import { IntlProvider, FormattedMessage } from 'react-intl';
import React from 'react';

import { checklistLoading } from '../../data/constants/loadingTypes';
import { courseDetails } from '../../utils/testConstants';
import CourseOutlineStatus from './';
import getFilteredChecklist from '../../utils/CourseChecklist/getFilteredChecklist';
import getValidatedValue from '../../utils/CourseChecklist/getValidatedValue';
import { Icon } from '@edx/paragon';
import { IntlProvider, FormattedMessage } from 'react-intl';
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
  track: () => {},
};

let wrapper;

const defaultProps = {
  courseBestPracticesData: {},
  courseLaunchData: {},
  enable_quality: true,
  getCourseBestPractices: () => { },
  getCourseLaunch: () => { },
  studioDetails: { course: courseDetails, enable_quality: true },
};

describe('CourseOutlineStatus', () => {
  describe('renders', () => {
    it('a header', () => {
      wrapper = shallowWithIntl(<CourseOutlineStatus {...defaultProps} />);

      const header = wrapper.find('h2');
      expect(header).toHaveLength(1);
      expect(header.find(WrappedMessage).prop('message')).toEqual(messages.checklistLabel);
    });

    it('a Hyperlink with correct href', () => {
      wrapper = shallowWithIntl(<CourseOutlineStatus {...defaultProps} />);

      const checklistsLink = wrapper.find(Hyperlink);
      expect(checklistsLink).toHaveLength(1);
      expect(checklistsLink.prop('destination')).toEqual(`/checklists/${defaultProps.studioDetails.course.id}`);
    });

    it('a loading icon instead of anchor when course launch is loading', () => {
      wrapper.setProps({
        loadingChecklists: [checklistLoading.COURSE_LAUNCH],
      });

      const anchor = wrapper.find('a');
      expect(anchor).toHaveLength(0);

      const loadingIconSection = wrapper.find(WrappedMessage).at(1);
      expect(loadingIconSection).toHaveLength(1);

      const loadingIcon = loadingIconSection.dive({ context: { intl } })
        .dive({ context: { intl } })
        .find(FormattedMessage)
        .dive({ context: { intl } })
        .find(Icon);

      expect(loadingIcon.prop('className')[0]).toEqual(expect.stringContaining('fa-spinner'));
      expect(loadingIcon.prop('className')[0]).toEqual(expect.stringContaining('fa-spin'));
    });

    it('a loading icon instead of an anchor when course best practices is loading', () => {
      wrapper.setProps({
        loadingChecklists: [checklistLoading.COURSE_BEST_PRACTICES],
      });

      const anchor = wrapper.find('a');
      expect(anchor).toHaveLength(0);

      const loadingIconSection = wrapper.find(WrappedMessage).at(1);
      expect(loadingIconSection).toHaveLength(1);

      const loadingIcon = loadingIconSection.dive({ context: { intl } })
        .dive({ context: { intl } })
        .find(FormattedMessage)
        .dive({ context: { intl } })
        .find(Icon);

      expect(loadingIcon.prop('className')[0]).toEqual(expect.stringContaining('fa-spinner'));
      expect(loadingIcon.prop('className')[0]).toEqual(expect.stringContaining('fa-spin'));
    });

    it('a loading icon instead of an anchor when both course launch and course best practices are loading', () => {
      wrapper.setProps({
        loadingChecklists: [checklistLoading.COURSE_BEST_PRACTICES, checklistLoading.COURSE_LAUNCH],
      });

      const anchor = wrapper.find('a');
      expect(anchor).toHaveLength(0);

      const loadingIconSection = wrapper.find(WrappedMessage).at(1);
      expect(loadingIconSection).toHaveLength(1);

      const loadingIcon = loadingIconSection.dive({ context: { intl } })
        .dive({ context: { intl } })
        .find(FormattedMessage)
        .dive({ context: { intl } })
        .find(Icon);

      expect(loadingIcon.prop('className')[0]).toEqual(expect.stringContaining('fa-spinner'));
      expect(loadingIcon.prop('className')[0]).toEqual(expect.stringContaining('fa-spin'));
    });

    describe('if enable_quality prop is true', () => {
      it('completion count text', () => {
        wrapper = shallowWithIntl(<CourseOutlineStatus {...defaultProps} />);

        // multiplied by two because of two checklists
        const completed = Object.values(validatedValues).filter(value => value).length;
        const total = Object.values(validatedValues).length;

        wrapper.setProps({
          courseBestPracticesData: testChecklist,
          courseLaunchData: testChecklist,
        });

        const checklistsLink = wrapper.find(Hyperlink);
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
          courseLaunchData: testChecklist,
        });

        const checklistsLink = wrapper.find(Hyperlink);
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

      const completionLink = wrapper.find(Hyperlink);
      const trackEventSpy = jest.fn();
      global.analytics.track = trackEventSpy;

      completionLink.simulate('click');
      expect(trackEventSpy).toHaveBeenCalledTimes(1);
    });
  });
});
