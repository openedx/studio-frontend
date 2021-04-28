import * as validators from './courseChecklistValidators';

describe('courseCheckValidators utility functions', () => {
  describe('hasWelcomeMessage', () => {
    it('returns true when course run has an update', () => {
      expect(validators.hasWelcomeMessage({ has_update: true })).toEqual(true);
    });

    it('returns false when course run does not have an update', () => {
      expect(validators.hasWelcomeMessage({ has_update: false })).toEqual(false);
    });
  });

  describe('hasGradingPolicy', () => {
    it('returns true when sum of weights is 1', () => {
      expect(validators.hasGradingPolicy(
        { has_grading_policy: true, sum_of_weights: 1 },
      )).toEqual(true);
    });

    it('returns true when sum of weights is not 1 due to floating point approximation (1.00004)', () => {
      expect(validators.hasGradingPolicy(
        { has_grading_policy: true, sum_of_weights: 1.00004 },
      )).toEqual(true);
    });

    it('returns false when sum of weights is not 1', () => {
      expect(validators.hasGradingPolicy(
        { has_grading_policy: true, sum_of_weights: 2 },
      )).toEqual(false);
    });

    it('returns true when has_grading_policy is true', () => {
      expect(validators.hasGradingPolicy(
        { has_grading_policy: true, sum_of_weights: 1 },
      )).toEqual(true);
    });

    it('returns false when has_grading_policy is false', () => {
      expect(validators.hasGradingPolicy(
        { has_grading_policy: false, sum_of_weights: 1 },
      )).toEqual(false);
    });
  });

  describe('hasCertificate', () => {
    it('returns true when certificates are activated and course run has a certificate', () => {
      expect(validators.hasCertificate({ is_activated: true, has_certificate: true }))
        .toEqual(true);
    });

    it('returns false when certificates are not activated and course run has a certificate', () => {
      expect(validators.hasCertificate({ is_activated: false, has_certificate: true }))
        .toEqual(false);
    });

    it('returns false when certificates are activated and course run does not have a certificate', () => {
      expect(validators.hasCertificate({ is_activated: true, has_certificate: false }))
        .toEqual(false);
    });

    it('returns false when certificates are not activated and course run does not have a certificate', () => {
      expect(validators.hasCertificate({ is_activated: false, has_certificate: false }))
        .toEqual(false);
    });
  });

  describe('hasDates', () => {
    it('returns true when course run has start date and end date', () => {
      expect(validators.hasDates({ has_start_date: true, has_end_date: true })).toEqual(true);
    });

    it('returns false when course run has no start date and end date', () => {
      expect(validators.hasDates({ has_start_date: false, has_end_date: true })).toEqual(false);
    });

    it('returns true when course run has start date and no end date', () => {
      expect(validators.hasDates({ has_start_date: true, has_end_date: false })).toEqual(false);
    });

    it('returns true when course run has no start date and no end date', () => {
      expect(validators.hasDates({ has_start_date: false, has_end_date: false })).toEqual(false);
    });
  });

  describe('hasAssignmentDeadlines', () => {
    it('returns true when a course run has start and end date and all assignments are within range', () => {
      expect(validators.hasAssignmentDeadlines(
        {
          assignments_with_dates_before_start: 0,
          assignments_with_dates_after_end: 0,
          assignments_with_ora_dates_after_end: 0,
          assignments_with_ora_dates_before_start: 0,
        },
        {
          has_start_date: true,
          has_end_date: true,
        },
      )).toEqual(true);
    });

    it('returns false when a course run has no start and no end date', () => {
      expect(validators.hasAssignmentDeadlines(
        {},
        {
          has_start_date: false,
          has_end_date: false,
        },
      )).toEqual(false);
    });

    it('returns false when a course has start and end date and no assignments', () => {
      expect(validators.hasAssignmentDeadlines(
        {
          total_number: 0,
        },
        {
          has_start_date: true,
          has_end_date: true,
        },
      )).toEqual(false);
    });

    it('returns false when a course run has start and end date and assignments before start', () => {
      expect(validators.hasAssignmentDeadlines(
        {
          assignments_with_dates_before_start: ['test'],
          assignments_with_dates_after_end: 0,
          assignments_with_ora_dates_after_end: 0,
          assignments_with_ora_dates_before_start: 0,
        },
        {
          has_start_date: true,
          has_end_date: true,
        },
      )).toEqual(false);
    });

    it('returns false when a course run has start and end date and assignments after end', () => {
      expect(validators.hasAssignmentDeadlines(
        {
          assignments_with_dates_before_start: 0,
          assignments_with_dates_after_end: ['test'],
          assignments_with_ora_dates_after_end: 0,
          assignments_with_ora_dates_before_start: 0,
        },
        {
          has_start_date: true,
          has_end_date: true,
        },
      )).toEqual(false);
    });
  });

  it(
    'returns false when a course run has start and end date and an ora with a date before start',
    () => {
      expect(validators.hasAssignmentDeadlines(
        {
          assignments_with_dates_before_start: 0,
          assignments_with_dates_after_end: 0,
          assignments_with_ora_dates_after_end: 0,
          assignments_with_ora_dates_before_start: ['test'],
        },
        {
          has_start_date: true,
          has_end_date: true,
        },
      )).toEqual(false);
    },
  );

  it(
    'returns false when a course run has start and end date and an ora with a date after end',
    () => {
      expect(validators.hasAssignmentDeadlines(
        {
          assignments_with_dates_before_start: 0,
          assignments_with_dates_after_end: 0,
          assignments_with_ora_dates_after_end: ['test'],
          assignments_with_ora_dates_before_start: 0,
        },
        {
          has_start_date: true,
          has_end_date: true,
        },
      )).toEqual(false);
    },
  );

  describe('hasShortVideoDuration', () => {
    it('returns true if course run has no videos', () => {
      expect(validators.hasShortVideoDuration({ total_number: 0 })).toEqual(true);
    });

    it('returns true if course run videos have a median duration <= to 600', () => {
      expect(validators.hasShortVideoDuration({ total_number: 1, durations: { median: 100 } }))
        .toEqual(true);
    });

    it('returns true if course run videos have a median duration > to 600', () => {
      expect(validators.hasShortVideoDuration({ total_number: 10, durations: { median: 700 } }))
        .toEqual(false);
    });
  });

  describe('hasMobileFriendlyVideos', () => {
    it('returns true if course run has no videos', () => {
      expect(validators.hasMobileFriendlyVideos({ total_number: 0 })).toEqual(true);
    });

    it('returns true if course run videos are >= 90% mobile friendly', () => {
      expect(validators.hasMobileFriendlyVideos({ total_number: 10, num_mobile_encoded: 9 }))
        .toEqual(true);
    });

    it('returns true if course run videos are < 90% mobile friendly', () => {
      expect(validators.hasMobileFriendlyVideos({ total_number: 10, num_mobile_encoded: 8 }))
        .toEqual(false);
    });
  });

  describe('hasDiverseSequences', () => {
    it('returns true if < 20% of visible subsections have more than one block type', () => {
      expect(validators.hasDiverseSequences({ total_visible: 10, num_with_one_block_type: 1 }))
        .toEqual(true);
    });

    it('returns false if no visible subsections', () => {
      expect(validators.hasDiverseSequences({ total_visible: 0 })).toEqual(false);
    });

    it('returns false if >= 20% of visible subsections have more than one block type', () => {
      expect(validators.hasDiverseSequences({ total_visible: 10, num_with_one_block_type: 3 }))
        .toEqual(false);
    });

    it('return false if < 0 visible subsections', () => {
      expect(validators.hasDiverseSequences({ total_visible: -1, num_with_one_block_type: 1 }))
        .toEqual(false);
    });
  });

  describe('hasWeeklyHighlights', () => {
    it('returns true when course run has highlights enabled', () => {
      const data = { highlights_active_for_course: true, highlights_enabled: true };
      expect(validators.hasWeeklyHighlights(data)).toEqual(true);
    });

    it('returns false when course run has highlights enabled', () => {
      const data = { highlights_active_for_course: false, highlights_enabled: false };
      expect(validators.hasWeeklyHighlights(data)).toEqual(false);

      data.highlights_enabled = true;
      data.highlights_active_for_course = false;
      expect(validators.hasWeeklyHighlights(data)).toEqual(false);

      data.highlights_enabled = false;
      data.highlights_active_for_course = true;
      expect(validators.hasWeeklyHighlights(data)).toEqual(false);
    });
  });

  describe('hasShortUnitDepth', () => {
    it('returns true when course run has median number of blocks <= 3', () => {
      const units = {
        num_blocks: {
          median: 3,
        },
      };

      expect(validators.hasShortUnitDepth(units)).toEqual(true);
    });

    it('returns false when course run has median number of blocks > 3', () => {
      const units = {
        num_blocks: {
          median: 4,
        },
      };

      expect(validators.hasShortUnitDepth(units)).toEqual(false);
    });
  });

  describe('hasProctoringEscalationEmail', () => {
    it('returns true when the course has a proctoring escalation email', () => {
      const proctoring = { has_proctoring_escalation_email: true };
      expect(validators.hasProctoringEscalationEmail(proctoring)).toEqual(true);
    });

    it('returns false when the course does not have a proctoring escalation email', () => {
      const proctoring = { has_proctoring_escalation_email: false };
      expect(validators.hasProctoringEscalationEmail(proctoring)).toEqual(false);
    });
  });
});
