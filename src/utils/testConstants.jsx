const courseDetails = {
  lang: 'en',
  url_name: 'course',
  name: 'edX Demonstration Course',
  display_course_number: '',
  num: 'DemoX',
  org: 'edX',
  id: 'course-v1:edX+DemoX+Demo_Course',
  revision: '',
  base_url: 'sfe',
};

export default courseDetails;

const thumbnail = '/animal';
const copyUrl = 'animal';

export const testAssetsList = [
  {
    display_name: 'cat.jpg',
    id: 'cat.jpg',
    thumbnail,
    locked: false,
    portable_url: copyUrl,
    external_url: copyUrl,
  },
  {
    display_name: 'dog.png',
    id: 'dog.png',
    thumbnail,
    locked: true,
    portable_url: null,
    external_url: null,
  },
  {
    display_name: 'bird.json',
    id: 'bird.json',
    thumbnail: null,
    locked: false,
    portable_url: null,
    external_url: copyUrl,
  },
  {
    display_name: 'fish.doc',
    id: 'fish.doc',
    thumbnail: null,
    locked: false,
    portable_url: copyUrl,
    external_url: null,
  },
];
