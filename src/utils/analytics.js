// eslint-disable-next-line import/prefer-default-export
export const trackEvent = (key, value) => {
  // TODO: Ticket EDUCATOR-3192
  // Add window.analytics.identify(user_id)
  // that uses LMS auth user_id
  window.analytics.track(key, value);
};
