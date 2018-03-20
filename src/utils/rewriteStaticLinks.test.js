import rewriteStaticLinks from './rewriteStaticLinks';

const imageFilename = 'banana.jpg';
const staticBaseUrl = '/static/';
const baseAssetUrl = '/asset@some-course@';

describe('rewriteStaticLinks utility function', () => {
  it('rewrites /static/ url with an /asset url', () => {
    const rewrittenUrl = rewriteStaticLinks(
      `${staticBaseUrl}${imageFilename}`,
      staticBaseUrl,
      baseAssetUrl,
    );
    expect(rewrittenUrl).toEqual(`${baseAssetUrl}${imageFilename}`);
  });
  it('rewrites /asset url with an /static/ url', () => {
    const rewrittenUrl = rewriteStaticLinks(
      `${baseAssetUrl}${imageFilename}`,
      baseAssetUrl,
      staticBaseUrl,
    );
    expect(rewrittenUrl).toEqual(`${staticBaseUrl}${imageFilename}`);
  });
  it('does not rewrite url with an /asset url when url does not start with /static/', () => {
    const nonStaticUrl = `/somepath/${staticBaseUrl}${imageFilename}`;
    const rewrittenUrl = rewriteStaticLinks(
      nonStaticUrl,
      baseAssetUrl,
      staticBaseUrl,
    );
    expect(rewrittenUrl).toEqual(nonStaticUrl);
  });
  it('does not rewrite url if from or to is null', () => {
    const staticUrl = `${staticBaseUrl}${imageFilename}`;
    let rewrittenUrl = rewriteStaticLinks(
      staticUrl,
      null,
      baseAssetUrl,
    );
    expect(rewrittenUrl).toEqual(staticUrl);

    rewrittenUrl = rewriteStaticLinks(
      staticUrl,
      staticBaseUrl,
      null,
    );
    expect(rewrittenUrl).toEqual(staticUrl);
  });
  it('does not rewrite non-relative url with an /asset url', () => {
    const nonRelativeUrl = `http://example.com/static/${imageFilename}`;
    const rewrittenUrl = rewriteStaticLinks(
      nonRelativeUrl,
      staticBaseUrl,
      baseAssetUrl,
    );
    expect(rewrittenUrl).toEqual(nonRelativeUrl);
  });
});
