export const hasWelcomeMessage = updates => (
  updates.has_update
);

export const hasGradingPolicy = grades => (
  grades.sum_of_weights === 1
);

export const hasCertificate = certificates => (
  certificates.is_activated && certificates.has_certificate
);

export const hasDates = dates => (
  dates.has_start_date && dates.has_end_date
);

export const hasAssignmentDeadlines = (assignments, dates) => {
  if (!hasDates(dates)) {
    return false;
  } else if (assignments.num_with_dates !== assignments.num_with_dates_after_start) {
    return false;
  } else if (assignments.num_with_dates !== assignments.num_with_dates_before_end) {
    return false;
  }

  return true;
};

export const hasShortVideoDuration = (videos) => {
  if (videos.total_number === 0) {
    return true;
  } else if (videos.total_number > 0 && videos.durations.median <= 600) {
    return true;
  }

  return false;
};

export const hasMobileFriendlyVideos = (videos) => {
  if (videos.total_number === 0) {
    return true;
  } else if (videos.total_number > 0 && (videos.num_mobile_encoded / videos.total_number) >= 0.9) {
    return true;
  }

  return false;
};

export const hasDiverseSequences = (subsections) => {
  if (subsections.total_visible === 0) {
    return false;
  } else if (subsections.total_visible > 0) {
    return ((subsections.num_with_one_block_type / subsections.total_visible) < 0.2);
  }

  return true;
};

export const hasWeeklyHighlights = sections => (
  sections.highlights_enabled
);

export const hasShortUnitDepth = units => (
  units.num_blocks <= 3
);
