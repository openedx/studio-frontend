import * as validators from './courseChecklistValidators';
import getValidatedValue from './getValidatedValue';

describe('getValidatedValue utility function', () => {
  const localValidators = validators;
  it('welcome message', () => {
    const spy = jest.fn();
    localValidators.hasWelcomeMessage = spy;

    const props = {
      data: {
        updates: {},
      },
    };

    getValidatedValue(props, 'welcomeMessage');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('grading policy', () => {
    const spy = jest.fn();
    localValidators.hasGradingPolicy = spy;

    const props = {
      data: {
        grades: {},
      },
    };

    getValidatedValue(props, 'gradingPolicy');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('certificate', () => {
    const spy = jest.fn();
    localValidators.hasCertificate = spy;

    const props = {
      data: {
        certificates: {},
      },
    };

    getValidatedValue(props, 'certificate');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('course dates', () => {
    const spy = jest.fn();
    localValidators.hasDates = spy;

    const props = {
      data: {
        dates: {},
      },
    };

    getValidatedValue(props, 'courseDates');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('assignment deadlines', () => {
    const spy = jest.fn();
    localValidators.hasAssignmentDeadlines = spy;

    const props = {
      data: {
        assignments: {},
        dates: {},
      },
    };

    getValidatedValue(props, 'assignmentDeadlines');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('video duration', () => {
    const spy = jest.fn();
    localValidators.hasShortVideoDuration = spy;

    const props = {
      data: {
        videos: {},
      },
    };

    getValidatedValue(props, 'videoDuration');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('mobile friendly video', () => {
    const spy = jest.fn();
    localValidators.hasMobileFriendlyVideos = spy;

    const props = {
      data: {
        videos: {},
      },
    };

    getValidatedValue(props, 'mobileFriendlyVideo');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('diverse sequences', () => {
    const spy = jest.fn();
    localValidators.hasDiverseSequences = spy;

    const props = {
      data: {
        subsections: {},
      },
    };

    getValidatedValue(props, 'diverseSequences');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('weekly highlights', () => {
    const spy = jest.fn();
    localValidators.hasWeeklyHighlights = spy;

    const props = {
      data: {
        sections: {},
      },
    };

    getValidatedValue(props, 'weeklyHighlights');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('unit depth', () => {
    const spy = jest.fn();
    localValidators.hasShortUnitDepth = spy;

    const props = {
      data: {
        units: {},
      },
    };

    getValidatedValue(props, 'unitDepth');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('proctoring email', () => {
    const spy = jest.fn();
    localValidators.hasProctoringEscalationEmail = spy;

    const props = {
      data: {
        proctoring: {},
      },
    };

    getValidatedValue(props, 'proctoringEmail');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('other', () => {
    const sampleID = 'edX';
    expect(() => getValidatedValue({}, sampleID)).toThrow(Error);
    expect(() => getValidatedValue({}, sampleID)).toThrow(`Unknown validator ${sampleID}`);
  });
});
