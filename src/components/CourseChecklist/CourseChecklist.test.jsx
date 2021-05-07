import { Icon, Hyperlink } from '@edx/paragon';
import { IntlProvider, FormattedMessage, FormattedNumber } from 'react-intl';
import React from 'react';

import CourseChecklist from '.';
import { courseDetails } from '../../utils/testConstants';
import getFilteredChecklist from '../../utils/CourseChecklist/getFilteredChecklist';
import getValidatedValue from '../../utils/CourseChecklist/getValidatedValue';
import messages from './displayMessages';
import { shallowWithIntl } from '../../utils/i18n/enzymeHelper';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';


// generating test checklist to avoid relying on actual data
const testChecklistData = ['welcomeMessage', 'gradingPolicy', 'certificate', 'courseDates', 'assignmentDeadlines'].reduce(((accumulator, currentValue) => { accumulator.push({ id: currentValue }); return accumulator; }), []);

/**
 * generating test validated values to mock the implementation
 * of the getValidatedValue utility function
 */
const validatedValues = {};
let i;

for (i = 0; i < Math.round(testChecklistData.length / 2); i += 1) {
  validatedValues[testChecklistData[i].id] = true;
}

for (i = Math.round(testChecklistData.length / 2); i < testChecklistData.length; i += 1) {
  validatedValues[testChecklistData[i].id] = false;
}

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

const testData = {
  assignments: {
    assignments_with_dates_after_end: [],
    assignments_with_dates_before_start: [],
    assignments_with_ora_dates_after_end: [],
    assignments_with_ora_dates_before_start: [],
  },
  is_self_paced: true,
  grades: {
    sum_of_weights: 1,
  },
  sections: {
    highlights_enabled: true,
  },
  certificates: {
    is_enabled: true,
  },
};

const defaultProps = {
  data: testData,
  dataHeading: <WrappedMessage message="test" />,
  dataList: testChecklistData,
  idPrefix: 'test',
  studioDetails: {
    enable_quality: true,
    course: courseDetails,
    links: {
      certificates: 'certificatesTest',
      course_outline: 'courseOutlineTest',
      course_updates: 'welcomeMessageTest',
      grading_policy: 'gradingPolicyTest',
      settings: 'settingsTest',
    },
  },
};

const getCompletionCountID = () => (`${defaultProps.idPrefix.split(/\s/).join('-')}-completion-count`);

describe('CourseChecklist', () => {
  describe('renders', () => {
    it('a heading using the dataHeading prop', () => {
      wrapper = shallowWithIntl(<CourseChecklist {...defaultProps} />);

      const heading = wrapper.find('h3').at(0);
      expect(heading).toHaveLength(1);

      expect(heading.containsMatchingElement(defaultProps.dataHeading)).toEqual(true);
    });

    it('a heading with correct props', () => {
      wrapper = shallowWithIntl(<CourseChecklist {...defaultProps} />);

      const heading = wrapper.find('h3');
      expect(heading.prop('aria-describedby')).toEqual(getCompletionCountID());
    });

    it('completion count text', () => {
      wrapper = shallowWithIntl(<CourseChecklist {...defaultProps} />);

      const completed = Object.values(validatedValues).filter(value => value).length;
      const total = Object.values(validatedValues).length;

      const completionCount = wrapper.find('.row .col').at(1).find(WrappedMessage);

      expect(completionCount).toHaveLength(1);
      expect(completionCount.prop('message')).toEqual(messages.completionCountLabel);
      expect(completionCount.prop('values').completed).toEqual(completed);
      expect(completionCount.prop('values').total).toEqual(total);
    });

    it('a completion count with correct props', () => {
      wrapper = shallowWithIntl(<CourseChecklist {...defaultProps} />);

      const completionCountSection = wrapper.find('.row .col').at(1).find(WrappedMessage);

      const completionCount = completionCountSection
        .dive({ context: { intl } })
        .dive({ context: { intl } })
        .find(FormattedMessage)
        .dive({ context: { intl } });

      expect(completionCount.prop('id')).toEqual(getCompletionCountID());
    });

    it('a loading spinner when isLoading prop is true', () => {
      wrapper = shallowWithIntl(<CourseChecklist {...defaultProps} />);

      wrapper.setProps({
        isLoading: true,
      });

      const heading = wrapper.find('h3').at(0);
      expect(heading).toHaveLength(1);

      const completionCountSection = wrapper.find('.row .col').at(1).find(WrappedMessage);
      expect(completionCountSection).toHaveLength(0);

      const loadingIconSection = wrapper.find('.row .col').at(2).find(WrappedMessage);
      expect(loadingIconSection).toHaveLength(1);

      const loadingIcon = loadingIconSection.dive({ context: { intl } })
        .dive({ context: { intl } })
        .find(FormattedMessage)
        .dive({ context: { intl } })
        .find(Icon);

      expect(loadingIcon.prop('className')[0]).toEqual(expect.stringContaining('fa-spinner'));
      expect(loadingIcon.prop('className')[0]).toEqual(expect.stringContaining('fa-spin'));
      expect(loadingIcon.prop('className')[0]).toEqual(expect.stringContaining('fa-5x'));
    });

    describe('checks with', () => {
      it('the correct number of checks', () => {
        wrapper = shallowWithIntl(<CourseChecklist {...defaultProps} />);

        const listItems = wrapper.find('[id^="checklist-item"]');
        expect(listItems).toHaveLength(testChecklistData.length);
      });

      testChecklistData.forEach((check) => {
        describe(`check with id '${check.id}'`, () => {
          wrapper = shallowWithIntl(<CourseChecklist {...defaultProps} />);
          const checkItem = wrapper.find(`#checklist-item-${check.id}`);

          it('renders', () => {
            expect(checkItem).toHaveLength(1);
          });

          it('has correct icon', () => {
            const iconSection = checkItem.find(WrappedMessage).at(0);

            const icon = iconSection.dive({ context: { intl } })
              .dive({ context: { intl } })
              .find(FormattedMessage)
              .dive({ context: { intl } })
              .find(Icon);

            expect(icon).toHaveLength(1);
            expect(icon.prop('id')).toEqual(`icon-${check.id}`);

            /**
             * className prop for Icon is array containing a single string
             * generated by classNames package
             */
            if (wrapper.state('values')[check.id]) {
              expect(icon.prop('className')[0]).toEqual(expect.stringContaining('fa-check-circle'));
              expect(icon.prop('className')[0]).toEqual(expect.stringContaining('text-success'));
            } else {
              expect(icon.prop('className')[0]).toEqual(expect.stringContaining('fa-circle-thin'));
              expect(icon.prop('className')[0]).toEqual(expect.stringContaining('checklist-icon-incomplete'));
            }
          });

          it('has correct short description', () => {
            expect(checkItem
              .containsMatchingElement(<div><WrappedMessage message={messages[`${check.id}ShortDescription`]} /></div>)).toEqual(true);
          });

          it('has correct long description', () => {
            expect(checkItem
              .containsMatchingElement(<div><WrappedMessage message={messages[`${check.id}longDescription`]} /></div>)).toEqual(true);
          });

          describe('has correct link', () => {
            const shouldShowLink = wrapper.instance().shouldShowUpdateLink(check.id);

            if (shouldShowLink) {
              it('with a Hyperlink', () => {
                const updateLink = checkItem.find(Hyperlink);

                expect(updateLink).toHaveLength(1);
              });

              it('a Hyperlink with correct props', () => {
                const updateLink = checkItem.find(Hyperlink);
                expect(updateLink.prop('className')).toEqual(expect.stringContaining('btn'));
                expect(updateLink.prop('className')).toEqual(expect.stringContaining('btn-primary'));
                expect(updateLink.prop('className')).toEqual(expect.stringContaining('checklist-item-link'));

                const updateLinkContent = shallowWithIntl(updateLink.prop('content'), { context: { intl } });
                expect(updateLinkContent.prop('message')).toEqual(messages.updateLinkLabel);
              });
            } else {
              it('without a Hyperlink', () => {
                const updateLink = checkItem.find(Hyperlink);

                expect(updateLink).toHaveLength(0);
              });
            }
          });
        });
      });
    });

    describe('welcomeMessage check with', () => {
      it('no comment section', () => {
        wrapper = shallowWithIntl(<CourseChecklist {...defaultProps} />);
        const comment = wrapper.find('#checklist-item-welcomeMessage').find('[data-identifier="comment"]');

        expect(comment).toHaveLength(0);
      });
    });
    describe('gradingPolicy check with', () => {
      it('no comment section if sum of weights is equal to 1', () => {
        wrapper = shallowWithIntl(<CourseChecklist {...defaultProps} />);
        const comment = wrapper.find('#checklist-item-gradingPolicy').find('[data-identifier="comment"]');

        expect(comment).toHaveLength(0);
      });

      describe('a comment section with', () => {
        const sumOfWeights = 0.5;

        beforeEach(() => {
          wrapper = shallowWithIntl(<CourseChecklist {...defaultProps} />);

          const newProps = {
            ...defaultProps,
          };
          newProps.data.grades.sum_of_weights = sumOfWeights;

          wrapper.setProps({
            newProps,
          });
        });

        it('a comment section if sum of weights is not equal to 1', () => {
          const comment = wrapper.find('#checklist-item-gradingPolicy').find('[data-identifier="comment"]');

          expect(comment).toHaveLength(1);
        });

        it('a comment section with a comment icon', () => {
          const comment = wrapper.find('#checklist-item-gradingPolicy').find('[data-identifier="comment"]');

          const icon = comment.find(Icon);

          expect(icon).toHaveLength(1);
        });

        it('a comment section with correct props', () => {
          const comment = wrapper.find('#checklist-item-gradingPolicy').find('[data-identifier="comment"]');

          const icon = comment.find(Icon);

          expect(icon.prop('className')[0]).toEqual(expect.stringContaining('fa'));
          expect(icon.prop('className')[0]).toEqual(expect.stringContaining('fa-lg'));
          expect(icon.prop('className')[0]).toEqual(expect.stringContaining('fa-comment'));
          expect(icon.prop('className')[0]).toEqual(expect.stringContaining('comment'));
        });

        it('a comment section with correct message', () => {
          const comment = wrapper.find('#checklist-item-gradingPolicy').find('[data-identifier="comment"]');

          const message = comment.find(WrappedMessage);

          expect(message).toHaveLength(1);
          expect(message.prop('message')).toEqual(messages.gradingPolicyComment);
          expect(message.prop('values').percent).toEqual(
            <FormattedNumber
              maximumFractionDigits={2}
              minimumFractionDigits={2}
              value={(sumOfWeights * 100).toFixed(2)}
            />,
          );
        });
      });
    });
    describe('certificate check with', () => {
      it('no comment section', () => {
        wrapper = shallowWithIntl(<CourseChecklist {...defaultProps} />);
        const comment = wrapper.find('#checklist-item-certificate').find('[data-identifier="comment"]');

        expect(comment).toHaveLength(0);
      });
    });
    describe('courseDates check with', () => {
      it('no comment section', () => {
        wrapper = shallowWithIntl(<CourseChecklist {...defaultProps} />);
        const comment = wrapper.find('#checklist-item-courseDates').find('[data-identifier="comment"]');

        expect(comment).toHaveLength(0);
      });
    });
    describe('proctoringEmail check with', () => {
      it('no comment section', () => {
        wrapper = shallowWithIntl(<CourseChecklist {...defaultProps} />);
        const comment = wrapper.find('#checklist-item-proctoringEmail').find('[data-identifier="comment"]');

        expect(comment).toHaveLength(0);
      });
    });
    describe('assignmentDeadlines check with', () => {
      it('no comment section if assignments with dates before start and after end are empty', () => {
        wrapper = shallowWithIntl(<CourseChecklist {...defaultProps} />);
        const comment = wrapper.find('#checklist-item-assignmentDeadlines').find('[data-identifier="comment"]');

        expect(comment).toHaveLength(0);
      });

      describe('a comment section with', () => {
        const assignmentsWithDatesAfterEnd = [{ display_name: 'test1', id: 'test1' }];
        const assignmentsWithDatesBeforeStart = [{ display_name: 'test2', id: 'test2' }];

        beforeEach(() => {
          wrapper = shallowWithIntl(<CourseChecklist {...defaultProps} />);

          const newProps = {
            ...defaultProps,
          };
          newProps.data.assignments.assignments_with_dates_after_end =
            assignmentsWithDatesAfterEnd;
          newProps.data.assignments.assignments_with_dates_before_start =
            assignmentsWithDatesBeforeStart;

          wrapper.setProps({
            newProps,
          });
        });

        it('a comment if assignments with dates before start and after end are not empty', () => {
          const comment = wrapper.find('#checklist-item-assignmentDeadlines').find('[data-identifier="comment"]');

          expect(comment).toHaveLength(1);
        });

        it('a comment section with a comment icon', () => {
          const comment = wrapper.find('#checklist-item-assignmentDeadlines').find('[data-identifier="comment"]');

          const icon = comment.find(Icon);

          expect(icon).toHaveLength(1);
        });

        it('a comment section with correct props', () => {
          const comment = wrapper.find('#checklist-item-assignmentDeadlines').find('[data-identifier="comment"]');

          const icon = comment.find(Icon);

          expect(icon.prop('className')[0]).toEqual(expect.stringContaining('fa'));
          expect(icon.prop('className')[0]).toEqual(expect.stringContaining('fa-lg'));
          expect(icon.prop('className')[0]).toEqual(expect.stringContaining('fa-comment'));
          expect(icon.prop('className')[0]).toEqual(expect.stringContaining('comment'));
        });

        it('a comment section with correct message', () => {
          const comment = wrapper.find('#checklist-item-assignmentDeadlines').find('[data-identifier="comment"]');

          const message = comment.find(WrappedMessage);

          expect(message).toHaveLength(1);
          expect(message.prop('message')).toEqual(messages.assignmentDeadlinesComment);
        });

        it('a comment section message with a Hyperlink for each assignment', () => {
          const comment = wrapper.find('#checklist-item-assignmentDeadlines').find('[data-identifier="comment"]');

          const assignmentList = comment.find('ul');
          expect(assignmentList).toHaveLength(1);

          const assignments = assignmentList.find('li');
          expect(assignments).toHaveLength(
            assignmentsWithDatesAfterEnd.length + assignmentsWithDatesBeforeStart.length,
          );

          assignments.find(Hyperlink).forEach((assignmentLink) => {
            const content = assignmentLink.prop('content');
            expect(content === assignmentsWithDatesAfterEnd[0].display_name ||
              content === assignmentsWithDatesBeforeStart[0].display_name).toEqual(true);

            const destination = assignmentLink.prop('destination');
            expect(destination === `${defaultProps.studioDetails.links.course_outline}#${assignmentsWithDatesAfterEnd[0].id}` ||
              destination === `${defaultProps.studioDetails.links.course_outline}#${assignmentsWithDatesBeforeStart[0].id}`).toEqual(true);
          });
        });

        it('calls trackEvent when an assignment Hyperlink is clicked', () => {
          const comment = wrapper.find('#checklist-item-assignmentDeadlines').find('[data-identifier="comment"]');

          const assignmentList = comment.find('ul');
          const assignments = assignmentList.find('li');

          const assignmentLink = assignments.find(Hyperlink).at(0);
          const trackEventSpy = jest.fn();
          global.analytics.track = trackEventSpy;

          assignmentLink.simulate('click');
          expect(trackEventSpy).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('behaves', () => {
    const emptyProps = {
      data: {},
      dataHeading: <WrappedMessage message="" />,
      dataList: [],
      idPrefix: '',
      studioDetails: {
        course: courseDetails,
        enable_quality: true,
        links: {
          certificates: '',
          course_outline: '',
          course_updates: '',
          grading_policy: '',
          settings: '',
        },
      },
    };

    it('has correct intitial state', () => {
      wrapper = shallowWithIntl(<CourseChecklist {...emptyProps} />);

      expect(wrapper.state('checks')).toEqual([]);
      expect(wrapper.state('totalCompletedChecks')).toEqual(0);
      expect(wrapper.state('values')).toEqual({});
    });

    it('has correct state after componentWillMount', () => {
      wrapper = shallowWithIntl(<CourseChecklist {...defaultProps} />);

      expect(wrapper.state('checks')).toEqual(defaultProps.dataList);
      expect(wrapper.state('totalCompletedChecks')).toEqual(Object.values(validatedValues).filter(value => value).length);
      expect(wrapper.state('values')).toEqual(validatedValues);
    });

    it('has correct state after componentWillReceiveProps', () => {
      wrapper = shallowWithIntl(<CourseChecklist {...emptyProps} />);

      wrapper.setProps({
        ...defaultProps,
      });

      expect(wrapper.state('checks')).toEqual(defaultProps.dataList);
      expect(wrapper.state('totalCompletedChecks')).toEqual(Object.values(validatedValues).filter(value => value).length);
      expect(wrapper.state('values')).toEqual(validatedValues);
    });

    it('getUpdateLinkDestination returns null for unknown checklist item id', () => {
      expect(wrapper.instance().getUpdateLinkDestination('test')).toBeNull();
    });

    it('getCommentSection returns null for unknown checklist item id', () => {
      expect(wrapper.instance().getCommentSection('test')).toBeNull();
    });

    it('calls trackEvent when an update link is clicked', () => {
      wrapper = shallowWithIntl(<CourseChecklist {...defaultProps} />);

      const updateLink = wrapper.find(Hyperlink).at(0);
      const trackEventSpy = jest.fn();
      global.analytics.track = trackEventSpy;

      updateLink.simulate('click');
      expect(trackEventSpy).toHaveBeenCalledTimes(1);
    });
  });
});
