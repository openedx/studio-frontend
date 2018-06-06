import React from 'react';
import CourseOutlineStatus from './';

import { courseDetails } from '../../utils/testConstants';
import getFilteredChecklist from '../../utils/CourseChecklist/getFilteredChecklist';
import getValidatedValue from '../../utils/CourseChecklist/getValidatedValue';
import { launchChecklist, bestPracticesChecklist } from '../../utils/CourseChecklist/courseChecklistData';
import { shallowWithIntl } from '../../utils/i18n/enzymeHelper';

// generating test checklist to avoid relying on actual data
const testChecklistData = ['a', 'b', 'c', 'd'].reduce(((accumulator, currentValue) => { accumulator.push({ id: currentValue, shortDescription: currentValue, longDescription: currentValue }); return accumulator; }), []);
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

let wrapper;

const defaultProps = {
  studioDetails: { course: courseDetails, enable_quality: true },
  getCourseQuality: () => { },
  getCourseValidation: () => { },
  courseBestPracticesData: {},
  courseLaunchData: {},
  enable_quality: true,
};

describe('CourseOutlineStatus', () => {
  describe('renders', () => {
    it('a header', () => {
      wrapper = shallowWithIntl(<CourseOutlineStatus {...defaultProps} />);

      const header = wrapper.find('h2');
      expect(header).toHaveLength(1);
      expect(header.text()).toEqual('Checklists');
    });

    it('an anchor with correct href', () => {
      wrapper = shallowWithIntl(<CourseOutlineStatus {...defaultProps} />);

      const anchor = wrapper.find('a');
      expect(anchor).toHaveLength(1);
      expect(anchor.prop('href')).toEqual(`/checklists/${defaultProps.studioDetails.course.id}`);
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

        const anchor = wrapper.find('a');
        expect(anchor.text()).toEqual(`${completed}/${total} complete`);
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

        const anchor = wrapper.find('a');
        expect(anchor.text()).toEqual(`${completed}/${total} complete`);
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

      wrapper = shallowWithIntl(<CourseOutlineStatus {...props} />);

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

      wrapper = shallowWithIntl(<CourseOutlineStatus {...props} />);

      expect(getCourseValidationSpy).toHaveBeenCalledTimes(1);
      expect(getCourseValidationSpy).toHaveBeenCalledWith(
        {},
        defaultProps.studioDetails.course,
      );
    });
  });
});
