import store from './store';

describe('Default store values', () => {
  it('sets studioDetails properly when defined in global', () => {
    const studioContext = {};
    expect(store.getState().studioDetails).toEqual(studioContext);
  });
});
