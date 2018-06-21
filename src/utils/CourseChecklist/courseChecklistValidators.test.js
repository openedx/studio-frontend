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
      expect(validators.hasGradingPolicy({ sum_of_weights: 1 })).toEqual(true);
    });

    it('returns false when sum of weights is not 1', () => {
      expect(validators.hasGradingPolicy({ sum_of_weights: 2 })).toEqual(false);
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
          num_with_dates: 10,
          num_with_dates_after_start: 10,
          num_with_dates_before_end: 10,
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

    it('returns false when a course run has start and end date and assignments before start', () => {
      expect(validators.hasAssignmentDeadlines(
        {
          num_with_dates: 10,
          num_with_dates_after_start: 5,
          num_with_dates_before_end: 10,
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
          num_with_dates: 10,
          num_with_dates_after_start: 10,
          num_with_dates_before_end: 5,
        },
        {
          has_start_date: true,
          has_end_date: true,
        },
      )).toEqual(false);
    });
  });

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
  });

  describe('hasWeeklyHighlights', () => {
    it('returns true when course run has highlights enabled', () => {
      expect(validators.hasWeeklyHighlights({ highlights_enabled: true })).toEqual(true);
    });

    it('returns false when course run has highlights enabled', () => {
      expect(validators.hasWeeklyHighlights({ highlights_enabled: false })).toEqual(false);
    });
  });

  describe('hasShortUnitDepth', () => {
    it('returns true when course run has number of blocks <= 3', () => {
      expect(validators.hasShortUnitDepth({ num_blocks: 2 })).toEqual(true);
    });

    it('returns false when course run has number of blocks > 3', () => {
      expect(validators.hasShortUnitDepth({ num_blocks: 4 })).toEqual(false);
    });
  });
});
