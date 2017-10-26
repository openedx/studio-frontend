import store from './store';

describe('Default store values', () => {
  it('sets courseDetails properly when defined in global', () => {
    const courseContext = {};
    expect(store.getState().courseDetails).toEqual(courseContext);
  });
});
