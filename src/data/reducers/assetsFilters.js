import { FILTER_UPDATED } from '../actions/assets';

const initialState = {
  courseId: 'course-v1:edX+DemoX+Demo_Course',
  page: 0,
  images: false,
  documents: false,
  other: false,
};

const assetsFilters = (state = initialState, action) => {
  switch (action.type) {
    case FILTER_UPDATED:
      return { ...state, ...action.data };
    default:
      return state;
  }
};

export default assetsFilters;
