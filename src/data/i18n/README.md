# Internationalization in studio-frontend

When you need to internationalize in a react context, this is the guide for you.

###### Relevant topics: [`studio-frontend`](https://github.com/topics/studio-frontend) [`react`](https://github.com/topics/react) [`react-intl`](https://github.com/topics/react-intl) [`reactifex`](https://github.com/topics/reactifex) [`transifex`](https://github.com/topics/transifex) [`keyvaluejson`](https://github.com/topics/keyvaluejson) [`localization`](https://github.com/topics/localization) [`i18n`](https://github.com/topics/i18n) [`internationalization`](https://github.com/topics/internationalization) [`icu`](https://github.com/topics/icu)

## Table of Contents

- [Background and problem context](#background)
- [react-intl basics](#react-intl-basics-in-studio-frontend)
  - [Mark strings to be localized](#flagging-strings-for-translation)
  - [Extract flagged messages](#extracting-flagged-messages)
  - [Out-of-band translation of extracted messages](#the-act-of-translation)
  - [Runtime Localization](#using-translated-strings)
- [Advanced Topics](#advanced-topics-in-studio-frontend-internationalization)
  - [Locale Data](#locale-data)
  - [Supported Languages](#supported-languages)
  - [WrappedMessage](#wrappedmessage)
  - [edx-platform integration](#edx-platform-integration)
  - [Pluralization](#pluralization)
  - [Transifex Comments](#push-comments-using-the-transifex-api)
  - [Jenkins Jobs](#jenkins-jobs)

---

## Background

To start, I assume you're more-or-less familiar with [React](https://reactjs.org/). A fair amount of what follows will relate specifically to [studio-frontend](https://www.npmjs.com/package/@edx/studio-frontend) and [edx-platform](https://github.com/edx/edx-platform), but it is my hope that the documentation will allow you to apply a similar system to other independent React applications.

The problem you are now ready to solve is as follows:
```
How can I ensure my React application is displayed in the end user's chosen language?
```
In our case, this led to some followup questions:
  - **How will I handle pluralization?** Does my tooling support that?
  - Why does all of the current edX i18n tooling assume python? **Can we do this entirely in a javascript context?**
  - Can we ensure we meet the guidelines specified in [WCAG 2.0 Success Criterion 3.1.2](https://www.w3.org/WAI/WCAG20/quickref/#qr-meaning-other-lang-id) (Language of Parts)?

[react-intl](https://github.com/yahoo/react-intl) is a library that `provides React components and an API to format dates, numbers, and strings, including pluralization and handling translations`, per the project's README. And they have a well-documented [wiki](https://github.com/yahoo/react-intl/wiki), huzzah! This is exactly what we need.

## react-intl basics in studio-frontend

### Flagging strings for translation

First things first, we can't localize strings for a user unless we know which strings should be localized. The simplest way is to use a [`FormattedMessage` component](https://github.com/yahoo/react-intl/wiki/Components#formattedmessage), which will have your string specified in a `defaultMessage` prop.

In the case of studio-frontend, we elected to abstract things a bit further and declare our strings-to-localize using the underlying [`defineMessages` API function](https://github.com/yahoo/react-intl/wiki/API#definemessages) directly in a separate file as seen [here](https://github.com/edx/studio-frontend/blob/8a3aa9d661492eb7d5d5b860571581837f02d8dc/src/components/AssetsTable/displayMessages.jsx). This allows us to know that all display strings are consistently located at `src/components/<component>/displayMessages.jsx`, which we feel is easier to work with from a "where is this message defined" perspective.

Note that whichever way you choose to go, react-intl will be converting your display strings into [message descriptors](https://github.com/yahoo/react-intl/wiki/API#message-descriptor), which contain the string itself, a unique identifier, and optionally a description.

### Extracting flagged messages

[`babel-plugin-react-intl`](https://github.com/yahoo/babel-plugin-react-intl) can then be used to extract the messages from your source files. If you, like us, want to *require* descriptions, set `"enforceDescriptions": true` in your `.babelrc` [as seen here](https://github.com/edx/studio-frontend/blob/ec2565cad082f3fe97841e9a3bc2636e1ba6e3af/.babelrc#L19).

The last step our message extraction is one of convenience. By default, `babel-plugin-react-intl` will extract your strings into multiple files, corresponding to the files the messages were declared in. This may be useful when your display strings are declared in `FormattedMessage` components all over the place, but it adds little value in our situation. To place all the strings in a single file, I created [`reactifex`](https://github.com/efischer19/reactifex/blob/4d4c3e3d86bd8ffcaba910c0692938f43390e969/README.md#compilation-mode), whose output looks [like this](https://github.com/edx/studio-frontend/blob/62f3877631c70fe006f372fe8b8e3bba46b1d3b3/src/data/i18n/default/transifex_input.json) (astute readers will note that descriptions are not preserved - more on this in a bit).

For studio-frontend, we have defined 2 simple make targets that will update the extracted messages-in-JSON file, as well as a [CI check](https://github.com/edx/studio-frontend/blob/e3a535c482a8cc8e4c29acfc735278fc5a24500c/Makefile#L66) to ensure they've been run on each PR.

So the end result of message declaration and extraction is a JSON file of messages to be translated. Conveniently, this file is able to be uploaded to Transifex as `KEYVALUEJSON`. We've configured [our project on Transifex](https://www.transifex.com/open-edx/edx-platform/studio-frontend/) to watch this file in github.

### The act of translation

For now, assume that the strings get translated, and we have in our possession a map that looks like `{message_id: translated_message}` for the user's current language. studio-frontend's translated message files look like [this](https://github.com/edx/studio-frontend/blob/e3a535c482a8cc8e4c29acfc735278fc5a24500c/src/data/i18n/locales/fr.json), as an example. We'll discuss how these files get updated as well as how the included message descriptors get injected into the app a bit later.

### Using translated strings

Now that you have your translated strings, the process of utilizing them is fairly straightforward. First, you need to ensure your messages (and the corresponding locale, more on that below) get passed into an [`IntlProvider`](https://github.com/yahoo/react-intl/wiki/Components#intl-provider-component) component that wraps your app's root. studio-frontend does so [here](https://github.com/edx/studio-frontend/blob/e3a535c482a8cc8e4c29acfc735278fc5a24500c/src/index.jsx#L25).

Within this context, any `FormattedMessage` will call [`formatMessage`](https://github.com/yahoo/react-intl/wiki/API#formatmessage) under the hood. As described in those docs, this will try to match up the `FormattedMessage`'s default message descriptor with the descriptor provided by the wrapping `IntlProvider`'s `messages` using `id` as a key, falling back to the default message definition if there's no match.

There are a few ways to utilize [`FormattedMessage`](https://github.com/yahoo/react-intl/wiki/Components#formattedmessage) objects in your React code; here are some examples from studio-frontend:
  - In the simplest case, the message component only gets a message descriptor, [as seen here](https://github.com/edx/studio-frontend/blob/e3a535c482a8cc8e4c29acfc735278fc5a24500c/src/components/AssetsTable/index.jsx#L26). This results in a simple `<span>` element, containing the translated string.
  - This is also true if you make use of the `value` prop to interpolate a variable into your message, [seen here](https://github.com/edx/studio-frontend/blob/e3a535c482a8cc8e4c29acfc735278fc5a24500c/src/components/AssetsTable/index.jsx#L355-L360).
  - For complex cases, you may pass as function as the message component's child. This is especially useful if you want to translate an attribute such as `aria-label`, [like we did here](https://github.com/edx/studio-frontend/blob/e3a535c482a8cc8e4c29acfc735278fc5a24500c/src/components/AssetsTable/index.jsx#L145-L156)

## Advanced topics in studio-frontend internationalization

### Locale data

[react-intl's docs explain this better than I can](https://github.com/yahoo/react-intl/wiki#loading-locale-data). Basically, you need to load a library-provided file and call [`addlocaleData`](https://github.com/yahoo/react-intl/wiki/API#addlocaledata) on it so that plurals, times, and numbers are formatted correctly. studio-frontend does that [here](https://github.com/edx/studio-frontend/blob/e3a535c482a8cc8e4c29acfc735278fc5a24500c/src/utils/i18n/loadI18nDomData.jsx#L10), using a given
locale code to look up the correct library-provided file in a map of supported languages.

### Supported Languages

We spent forever trying to make our setup such that each available (from react-intl) language was available to webpack separately, but ended up realizing that we need to enumerate the list of available (from edX) languages and package them all up in the studio-frontend bundle. This is deemed acceptable because the language list is fairly static, and there are only 5 of them including the default English. The exported languages (and their corresponding locales) are defined
[here](https://github.com/edx/studio-frontend/blob/e3a535c482a8cc8e4c29acfc735278fc5a24500c/src/data/i18n/locales/currentlySupportedLangs.jsx), you can read [this PR](https://github.com/edx/studio-frontend/pull/124) for more detail.

As an aside, note that the translated message files live at `src/data/i18n/locales/` and are imported into the above file. These are updated by a weekly job, and are imported into the above `currentlySupportedLangs.jsx` so as to include them in our bundled distribution.

### WrappedMessage

As mentioned above, we want to ensure we comply with WCAG guidelines to the fullest extent possible. To that end, we created a wrapper around the default `FormattedMessage`, creatively named [`WrappedMessage`](https://github.com/edx/studio-frontend/blob/e3a535c482a8cc8e4c29acfc735278fc5a24500c/src/utils/i18n/formattedMessageWrapper.jsx). This wraps the component in a `<span lang=<lang_code>>` element, which allows screen readers to know the language. Notably, this approach allows for each string to be wrapped with the correct `lang`, even if we're missing the translation for that string and fall back to the English default.

Also note that we define the `message` prop in such a way as to exactly match the message descriptor objects linked above. This allows us to use the messages we define in a separate file as a variable, then have the `defaultMessage` and `id` sub-props fan out into `FormattedMessage` as described in the react-intl docs.

Use of this wrapper is totally optional; in the remainder of this document I'll refer to `FormattedMessage` instead, since they do the exact same thing and it may help when searching the react-intl wiki.

### edx-platform Integration

It's one thing to have your React application load in a particular language. But what if you didn't know *which* language in any sort of javascript context, say if you're getting this app as a python-rendered response from a django server that contains the user's desired language deep in python land? If you were to declare the following something of a "hack", I wouldn't fight you. I do resent the notion of it being a *dirty* hack though, that'll come later.

The solution we landed on is to have the django server grab the desired data from our webpack bundle and load it into the DOM directly, in a predefined location. Then, our react code can extract the contents and dynamically load it into the root `IntlProvider`. The code for this can be seen in [our mako entry point](https://github.com/edx/edx-platform/blob/04279bf5afc93436c7dd2eb3ac883da0420b2c43/common/djangoapps/pipeline_mako/templates/static_content.html#L93-L122) and [the helper function it calls](https://github.com/edx/edx-platform/blob/04279bf5afc93436c7dd2eb3ac883da0420b2c43/common/djangoapps/pipeline_mako/helpers/studiofrontend.py#L13-L31) on the edx-platform side, and then in [our app's root](https://github.com/edx/studio-frontend/blob/e3a535c482a8cc8e4c29acfc735278fc5a24500c/src/index.jsx#L22-L25) and [the helper function it calls](https://github.com/edx/studio-frontend/blob/e3a535c482a8cc8e4c29acfc735278fc5a24500c/src/utils/i18n/loadI18nDomData.jsx#L6-L20) on the studio-frontend side.

### Pluralization

pluralization - English only has "singular" and "plural" (or "not singular"); other languages such as Russian or Arabic have more than two options, depending on whether there exist zero, one, two, a few, or many items. If we do not handle these cases, a string as incorrect as `1 results` may be rendered in those languages.

This problem is why we stopped using python-centric Transifex tools. react-intl, being part of FormatJS, handles [pluralizable strings in ICU format](https://formatjs.io/guides/message-syntax/#plural-format) quite well out-of-the-box. The problem for us initially came in when sending these files up to Transifex. Every previous edX project in Transifex used PO files to specify strings. For a hot sec, we were converting our js-defined messages into python-defined PO files, then the reverse on
returning from transifex. However, this broke horribly when we got to pluralizable strings, since the conversion tools we were using were not built to handle that case.

Instead of fixing the tool, we opted to keep things in JSON and use a [`KEYVALUEJSON` file](https://docs.transifex.com/formats/json). This works correctly and keeps plurals working (note that Transifex already had support for translators to pluralize), but it came at a cost. That file type is so simplified that it loses track of descriptions, which can be vital to helping a translator know the context of the string they're translating. To solve that, I again turned to reactifex.

### Push comments using the Transifex API

This *is* a dirty hack, for some value of the words "dirty" and "hack". Transifex provides a [rather nice API](https://docs.transifex.com/api/introduction), which can do 2 important things:
- [download metadata about your strings](https://docs.transifex.com/api/resource-strings#downloading-a-collection-of-source-strings-)
- [edit comments on your strings](https://docs.transifex.com/api/resource-strings#editing-comments,-character-limits,-and-tags-for-a-set-of-source-strings)

So naturally, I wrote a js library that will make the above calls using curl. I used curl because that's what Transifex documented, and I couldn't get js calls working correctly without external dependencies (something I'm a bit stubborn about when writing libraries). [reactifex's documentation](https://github.com/efischer19/reactifex/blob/42ff3cc97c6fe8562f9bb403c0687b03cd8c4b13/README.md#comment-pushing) explains in more detail, and you can see it in action in studio-frontend [in our
Makefile](https://github.com/edx/studio-frontend/blob/e3a535c482a8cc8e4c29acfc735278fc5a24500c/Makefile#L69-L75)

### Jenkins Jobs

There are only 2 things remaining that I haven't explained here - how do translated strings get pulled down from Transifex and updated in our repo, and how do we push comments to Transifex (given the fact that Transifex watches github for the main `KEYVALUEJSON` file)? The answer in both cases is a weekly job. At edX, we run them in Jenkins, but it could be any type of cron job.

The full details of these jobs and their setup is well beyond the scope of this document, I'll document that in an internal wiki page later. Suffice it to say that the push job runs [these lines surrounding `make push_translations`](https://github.com/edx/studio-frontend/blob/e3a535c482a8cc8e4c29acfc735278fc5a24500c/Makefile#L69-L75), and the pull job runs [`make pull_translations`](https://github.com/edx/studio-frontend/blob/e3a535c482a8cc8e4c29acfc735278fc5a24500c/Makefile#L77-L79)
