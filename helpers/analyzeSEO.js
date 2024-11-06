const cheerio = require('cheerio');

function analyzeSEO(html, url) {
  const $ = cheerio.load(html);
  const suggestions = {};

  // Helper function for adding a suggestion
  const addSuggestion = (key, message) => {
    suggestions[key] = message;
  };

  // Helper function to check if element exists and its content length
  const checkLength = (element, minLength, maxLength, message) => {
    const content = $(element).text().trim();
    if (!content) {
      return message;
    }
    const length = content.length;
    if (length < minLength || length > maxLength) {
      return `Content should be between ${minLength} and ${maxLength} characters.`;
    }
    return null;
  };

  // Check for title tag
  const titleSuggestion = checkLength('title', 10, 60, 'Missing or invalid title tag. Add a unique, descriptive title.');
  if (titleSuggestion) addSuggestion('title', titleSuggestion);

  // Check for meta description
  const metaDescription = $('meta[name="description"]').attr('content');
  const metaDescriptionSuggestion = checkLength('meta[name="description"]', 50, 160, 'Missing or invalid meta description. Add a concise summary.');
  if (metaDescriptionSuggestion) addSuggestion('metaDescription', metaDescriptionSuggestion);

  // Check for canonical tag
  if (!$('link[rel="canonical"]').attr('href')) {
    addSuggestion('canonical', 'Missing canonical tag. Add a canonical link to prevent duplicate content issues.');
  }

  // Check for viewport meta tag
  if (!$('meta[name="viewport"]').attr('content')) {
    addSuggestion('viewport', 'Missing viewport meta tag. Add this tag for mobile responsiveness.');
  }

  // Check for structured data (JSON-LD or Microdata)
  if (!$('script[type="application/ld+json"]').html() && !$('[itemprop]').length) {
    addSuggestion('structuredData', 'Missing structured data. Consider adding JSON-LD or microdata for rich snippets.');
  }

  // Check for H1 tag
  if (!$('h1').first().text()) {
    addSuggestion('h1', 'Missing H1 tag. Add a primary heading (H1) to the page.');
  }

  // Check for additional headings (H2 - H6)
  if ($('h2').length < 1) {
    addSuggestion('headings', 'Consider adding H2 or more detailed headings for better content structure.');
  }

  // Check for alt attributes in images
  const imagesWithoutAlt = $('img').filter((i, img) => !$(img).attr('alt')).length;
  if (imagesWithoutAlt > 0) {
    addSuggestion('images', `${imagesWithoutAlt} images are missing alt attributes. Add descriptive alt text for accessibility.`);
  }

  // Check internal and external links
  const internalLinks = $('a[href^="/"]').length;
  const externalLinks = $('a[href^="http"]').length;
  if (internalLinks < 5) {
    addSuggestion('internalLinks', 'Consider adding more internal links to improve navigation and SEO.');
  }
  if (externalLinks < 2) {
    addSuggestion('externalLinks', 'Consider adding more external links to reputable sites.');
  }

  // Check Open Graph tags
  if (!$('meta[property="og:title"]').attr('content')) {
    addSuggestion('ogTags', 'Missing Open Graph tags. Consider adding them for social sharing.');
  }

  // Check for sufficient content word count
  const textContent = $('body').text().trim();
  const wordCount = textContent.split(/\s+/).length;
  if (wordCount < 300) {
    addSuggestion('wordCount', 'Content is too short. Aim for at least 300 words for better SEO.');
  }

  // Check for Robots meta tag
  if (!$('meta[name="robots"]').attr('content')) {
    addSuggestion('robotsMeta', 'Missing robots meta tag. Use it to control indexing and crawling.');
  }

  // Check if favicon is present
  if (!$('link[rel="icon"], link[rel="shortcut icon"]').attr('href')) {
    addSuggestion('favicon', 'Missing favicon. Add one for brand recognition.');
  }

  // Check for hreflang tags (for international SEO)
  if ($('link[rel="alternate"][hreflang]').length < 1) {
    addSuggestion('hreflang', 'Missing hreflang tags. Consider adding them if targeting multiple languages.');
  }

  // Check page load performance metrics (simplified)
  addSuggestion('performance', 'Run a performance audit using tools like Lighthouse for load time and resource optimization.');

  // Ensure URLs are SEO-friendly
  if (/[^a-zA-Z0-9/-]/.test(url)) {
    addSuggestion('urlStructure', 'URL contains special characters. Use clean, descriptive URLs.');
  }

  // Check for page title uniqueness (simplified)
  addSuggestion('titleUniqueness', 'Ensure this page title is unique compared to other pages on the site.');

  // Ensure HTTPS is used
  if (!url.startsWith('https://')) {
    addSuggestion('https', 'Switch to HTTPS for better security and SEO.');
  }

  // Verify presence of Twitter Cards
  if (!$('meta[name="twitter:card"]').attr('content')) {
    addSuggestion('twitterCard', 'Missing Twitter Cards. Consider adding them for better Twitter sharing.');
  }

  // Check if page is mobile-friendly
  addSuggestion('mobileFriendly', 'Use mobile-friendly layouts for a better user experience on all devices.');

  // Check for minimum font size for accessibility
  const fontSize = $('body').css('font-size');
  if (parseInt(fontSize) < 14) {
    addSuggestion('fontSize', 'Increase font size to at least 14px for readability.');
  }

  // Check for lazy loading on images
  if ($('img[loading="lazy"]').length < 1) {
    addSuggestion('lazyLoading', 'Consider adding lazy loading to images for better performance.');
  }

  // Check for third-party scripts impacting load time
  $('script').each((i, script) => {
    const src = $(script).attr('src');
    if (src && (src.includes('facebook') || src.includes('twitter') || src.includes('ads'))) {
      addSuggestion('thirdPartyScripts', 'Optimize third-party scripts for faster load times.');
    }
  });

  return suggestions;
}

module.exports = { analyzeSEO };
