const fallbackSiteUrl = "https://kitweight.vercel.app";

function parseSiteUrl(value: string) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  const url = new URL(withProtocol);

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error("SITE_URL must use the http or https protocol.");
  }

  return new URL(url.origin);
}

export const siteUrl = parseSiteUrl(
  process.env.SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    fallbackSiteUrl,
);

export const siteName = "KitWeight";
export const siteTitle = "KitWeight — Local-first hiking gear planner";
export const siteDescription =
  "Plan your hiking pack, compare carried weight by category, and keep your gear list private in your browser.";
export const repositoryUrl = "https://github.com/andreedd/kitweight";
