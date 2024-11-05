const cheerio = require('cheerio');

function analyzeSEO(html, url) {
  const $ = cheerio.load(html);
  const suggestions = {};

  // Check for title tag
  const title = $('title').text();
  if (!title) {
    suggestions.title = 'Missing title tag. Add a unique, descriptive title.';
  } else if (title.length < 10 || title.length > 60) {
    suggestions.title = 'Title should be between 10 and 60 characters.';
  }

  // Check for meta description
  const metaDescription = $('meta[name="description"]').attr('content');
  if (!metaDescription) {
    suggestions.metaDescription = 'Missing meta description. Add a concise summary.';
  } else if (metaDescription.length < 50 || metaDescription.length > 160) {
    suggestions.metaDescription = 'Meta description should be between 50 and 160 characters.';
  }

  // Check for H1 tag
  const h1 = $('h1').first().text();
  if (!h1) {
    suggestions.h1 = 'Missing H1 tag. Add a primary heading (H1) to the page.';
  }

  // Check for alt attributes in images
  const imagesWithoutAlt = $('img').filter((i, img) => !$(img).attr('alt')).length;
  if (imagesWithoutAlt > 0) {
    suggestions.images = `${imagesWithoutAlt} images are missing alt attributes. Add descriptive alt text for accessibility.`;
  }

  // Check internal and external links
  const internalLinks = $('a[href^="/"]').length;
  const externalLinks = $('a[href^="http"]').length;
  if (internalLinks < 5) {
    suggestions.internalLinks = 'Consider adding more internal links to improve navigation and SEO.';
  }
  if (externalLinks < 2) {
    suggestions.externalLinks = 'Consider adding more external links to reputable sites.';
  }

  return suggestions;
}

module.exports = { analyzeSEO };
