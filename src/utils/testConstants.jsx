import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import thunkMiddleware from 'redux-thunk';

import accessibility from '../data/reducers/accessibility';
import { assets, metadata } from '../data/reducers/assets';

export const courseDetails = {
  base_url: 'sfe',
  course_release_date: 'Jan 01, 2016 at 00:00 UTC',
  display_course_number: '',
  id: 'course-v1:edX+DemoX+Demo_Course',
  lang: 'en',
  name: 'edX Demonstration Course',
  num: 'DemoX',
  org: 'edX',
  revision: '',
  url_name: 'course',
};

const thumbnail = '/animal';
const copyUrl = 'animal';

export const testAssetsList = [
  {
    date_added: 'Jan 01, 2018 at 01:00 UTC',
    display_name: 'cat.jpg',
    id: 'cat.jpg',
    thumbnail,
    locked: false,
    portable_url: copyUrl,
    external_url: copyUrl,
  },
  {
    date_added: 'Jan 02, 2018 at 02:00 UTC',
    display_name: 'dog.png',
    id: 'dog.png',
    thumbnail,
    locked: true,
    portable_url: null,
    external_url: null,
  },
  {
    date_added: 'Jan 03, 2018 at 03:00 UTC',
    display_name: 'bird.json',
    id: 'bird.json',
    thumbnail: null,
    locked: false,
    portable_url: null,
    external_url: copyUrl,
  },
  {
    date_added: 'Jan 04, 2018 at 04:00 UTC',
    display_name: 'fish.doc',
    id: 'fish.doc',
    thumbnail: null,
    locked: false,
    portable_url: copyUrl,
    external_url: null,
  },
];

/*
  Use studioContextOptions to pass in any application specific context that is required,
  aside from courseDetails.
*/
export const getMockStore = (studioContextOptions) => {
  const studioContext = {

    course: { ...courseDetails },
    ...studioContextOptions,
  };

  const studioDetails = () => studioContext;

  const rootReducer = combineReducers({
    accessibility,
    assets,
    metadata,
    studioDetails,
  });

  const store = createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(thunkMiddleware),
    ),
  );

  return store;
};
