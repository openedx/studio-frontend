const loadI18nDomData = () => {
  try {
    const domLocale = document.getElementById('SFE_i18n_locale').innerHTML;
    const domMessages = JSON.parse(document.getElementById('SFE_i18n_messages').innerHTML);
    return {"locale": domLocale, "messages": domMessages};
  } catch (err) {
    console.log(err);
  }
  // fail back to default english values if any errors
  return { "locale": "en", "messages": {} };
};

export default loadI18nDomData;
