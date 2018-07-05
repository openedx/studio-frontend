import { trackEvent } from './analytics';

const key = 'testKey';
const category = 'testCategory';
const courseId = 'testId';
const eventType = 'testEventType';
global.analytics = {
  track: () => {},
};

describe('Analytics Utility Functions', () => {
  describe('trackEvent', () => {
    it('calls the global track function', () => {
      const analyticsSpy = jest.fn();
      global.analytics.track = analyticsSpy;
      trackEvent(key, {
        category,
        event_type: eventType,
        label: courseId,
      });

      expect(analyticsSpy).toHaveBeenCalledTimes(1);
      expect(analyticsSpy).toHaveBeenCalledWith(key, {
        category,
        label: courseId,
        event_type: eventType,
      });
    });
  });
});
