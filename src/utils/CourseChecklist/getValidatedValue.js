import * as healthValidators from './courseChecklistValidators';

const getValidatedValue = (props, id) => {
  switch (id) {
    case 'welcomeMessage':
      return healthValidators.hasWelcomeMessage(props.data.updates);
    case 'gradingPolicy':
      return healthValidators.hasGradingPolicy(props.data.grades);
    case 'certificate':
      return healthValidators.hasCertificate(props.data.certificates);
    case 'courseDates':
      return healthValidators.hasDates(props.data.dates);
    case 'assignmentDeadlines':
      return healthValidators.hasAssignmentDeadlines(props.data.assignments, props.data.dates);
    case 'videoDuration':
      return healthValidators.hasShortVideoDuration(props.data.videos);
    case 'mobileFriendlyVideo':
      return healthValidators.hasMobileFriendlyVideos(props.data.videos);
    case 'diverseSequences':
      return healthValidators.hasDiverseSequences(props.data.subsections);
    case 'weeklyHighlights':
      return healthValidators.hasWeeklyHighlights(props.data.sections);
    case 'unitDepth':
      return healthValidators.hasShortUnitDepth(props.data.units);
    default:
      throw new Error(`Unknown validator ${id}.`);
  }
};

export default getValidatedValue;
