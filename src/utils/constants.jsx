import PropTypes from 'prop-types';

export const ASSET_SHAPE = {
  content_type: PropTypes.string,
  date_added: PropTypes.string,
  display_name: PropTypes.string,
  external_url: PropTypes.string,
  id: PropTypes.string,
  locked: PropTypes.bool,
  portable_url: PropTypes.string,
  thumbnail: PropTypes.string,
  url: PropTypes.string,
};

export const ASSET_TYPES_SHAPE = {
  Audio: PropTypes.bool,
  Code: PropTypes.bool,
  Documents: PropTypes.bool,
  Images: PropTypes.bool,
  OTHER: PropTypes.bool,
};

export const RESPONSE_SHAPE = {
  assetTypes: PropTypes.arrayOf(PropTypes.shape(ASSET_TYPES_SHAPE)),
  assets: PropTypes.arrayOf(PropTypes.shape(ASSET_SHAPE)),
  direction: PropTypes.string,
  end: PropTypes.number,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  sort: PropTypes.string,
  start: PropTypes.number,
  textSearch: PropTypes.string,
  totalCount: PropTypes.number,
};

export const ASSET_STATUS_SHAPE = {
  response: PropTypes.shape(RESPONSE_SHAPE),
  type: PropTypes.string,
};

export const COURSE_SHAPE = {
  base_url: PropTypes.string,
  display_course_number: PropTypes.string,
  id: PropTypes.string,
  lang: PropTypes.string,
  name: PropTypes.string,
  num: PropTypes.string,
  org: PropTypes.string,
  revision: PropTypes.string,
  url_name: PropTypes.string,
};

export const HELP_TOKENS_SHAPE = {
  files: PropTypes.string,
  image_accessibility: PropTypes.string,
};

export const UPLOAD_SETTINGS_SHAPE = {
  max_file_size_in_mbs: PropTypes.number,
};

export const STUDIO_DETAIL_LINK_SHAPE = {
  course_updates: PropTypes.string,
  grading_policy: PropTypes.string,
  certificates: PropTypes.string,
  settings: PropTypes.string,
  proctored_exam_settings: PropTypes.string,
};

export const STUDIO_DETAIL_SHAPE = {
  course: PropTypes.shape(COURSE_SHAPE),
  help_tokens: PropTypes.shape(HELP_TOKENS_SHAPE),
  upload_settings: PropTypes.shape(UPLOAD_SETTINGS_SHAPE),
  links: PropTypes.shape(STUDIO_DETAIL_LINK_SHAPE),
};

export const SECTIONS_SHAPE = {
  number_with_highlights: PropTypes.number,
  total_visible: PropTypes.number,
  total_number: PropTypes.number,
  highlights_enabled: PropTypes.bool,
  highlights_active_for_course: PropTypes.bool,
};

export const SUBSECTIONS_SHAPE = {
  num_block_types: PropTypes.objectOf(
    PropTypes.oneOfType([null, PropTypes.number])
  ),
  num_with_one_block_type: PropTypes.number,
  total_visible: PropTypes.number,
};

export const UNITS_SHAPE = {
  num_blocks: PropTypes.objectOf(PropTypes.oneOfType([null, PropTypes.number])),
  total_visible: PropTypes.number,
};

export const VIDEOS_SHAPE = {
  durations: PropTypes.objectOf(PropTypes.oneOfType([null, PropTypes.number])),
  num_mobile_encoded: PropTypes.number,
  num_with_val_id: PropTypes.number,
  total_number: PropTypes.number,
};

export const COURSE_BEST_PRACTICES_DATA_SHAPE = {
  sections: PropTypes.shape(SECTIONS_SHAPE),
  subsections: PropTypes.shape(SUBSECTIONS_SHAPE),
  units: PropTypes.shape(UNITS_SHAPE),
  videos: PropTypes.shape(UNITS_SHAPE),
  is_self_paced: PropTypes.bool,
};
