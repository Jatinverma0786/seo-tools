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

  // Check for canonical tag
  const canonical = $('link[rel="canonical"]').attr('href');
  if (!canonical) {
    suggestions.canonical = 'Missing canonical tag. Add a canonical link to prevent duplicate content issues.';
  }

  // Check for viewport meta tag
  const viewport = $('meta[name="viewport"]').attr('content');
  if (!viewport) {
    suggestions.viewport = 'Missing viewport meta tag. Add this tag for mobile responsiveness.';
  }

  // Check for structured data
  const structuredData = $('script[type="application/ld+json"]').html();
  if (!structuredData) {
    suggestions.structuredData = 'Missing structured data. Consider adding JSON-LD or microdata for rich snippets.';
  }

  // Check for H1 tag
  const h1 = $('h1').first().text();
  if (!h1) {
    suggestions.h1 = 'Missing H1 tag. Add a primary heading (H1) to the page.';
  }

  // Check for additional headings (H2 - H6)
  const h2 = $('h2').length;
  if (h2 < 1) {
    suggestions.headings = 'Consider adding H2 or more detailed headings for better content structure.';
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

  // Check Open Graph tags
  const ogTitle = $('meta[property="og:title"]').attr('content');
  if (!ogTitle) {
    suggestions.ogTags = 'Missing Open Graph tags. Consider adding them for social sharing.';
  }

  // Check for sufficient content word count
  const textContent = $('body').text();
  const wordCount = textContent.split(/\s+/).length;
  if (wordCount < 300) {
    suggestions.wordCount = 'Content is too short. Aim for at least 300 words for better SEO.';
  }

  // Check for Robots meta tag
  const robotsMeta = $('meta[name="robots"]').attr('content');
  if (!robotsMeta) {
    suggestions.robotsMeta = 'Missing robots meta tag. Use it to control indexing and crawling.';
  }

  // Check if favicon is present
  const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').attr('href');
  if (!favicon) {
    suggestions.favicon = 'Missing favicon. Add one for brand recognition.';
  }

  // Check for hreflang tags (for international SEO)
  const hreflangs = $('link[rel="alternate"][hreflang]').length;
  if (hreflangs < 1) {
    suggestions.hreflang = 'Missing hreflang tags. Consider adding them if targeting multiple languages.';
  }

  // Analyze images for large file sizes
  $('img').each((i, img) => {
    const src = $(img).attr('src');
    if (src && src.includes('.jpg') || src.includes('.png')) {
      // Hypothetically analyze image sizes here; in reality, you'd fetch and check each image size
      suggestions.imageOptimization = 'Ensure images are optimized and compressed for faster load times.';
    }
  });

  // Check for text-to-HTML ratio
  const htmlLength = $.html().length;
  const textLength = $('body').text().length;
  const textToHtmlRatio = (textLength / htmlLength) * 100;
  if (textToHtmlRatio < 10) {
    suggestions.textToHtmlRatio = 'Low text-to-HTML ratio. Add more content or reduce excessive HTML.';
  }

  // Check for presence of breadcrumb navigation
  const breadcrumb = $('nav[aria-label="breadcrumb"]').length;
  if (breadcrumb < 1) {
    suggestions.breadcrumb = 'Consider adding breadcrumb navigation for better usability and SEO.';
  }

  // Ensure all headings follow a logical order (H1, H2, H3, etc.)
  const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const headingOrder = headingTags.map(tag => $(tag).length > 0);
  if (!headingOrder.every((v, i, arr) => !arr[i + 1] || v >= arr[i + 1])) {
    suggestions.headingOrder = 'Ensure headings follow a logical order for readability and SEO.';
  }

  // Check for AMP (Accelerated Mobile Pages)
  const amp = $('link[rel="amphtml"]').attr('href');
  if (!amp) {
    suggestions.amp = 'Consider implementing AMP for improved mobile page speed and SEO.';
  }

  // Check page load performance metrics (simplified)
  suggestions.performance = 'Run a performance audit using tools like Lighthouse for load time and resource optimization.';

  // Ensure URLs are SEO-friendly
  const urlStructure = /[^a-zA-Z0-9/-]/.test(url);
  if (urlStructure) {
    suggestions.urlStructure = 'URL contains special characters. Use clean, descriptive URLs.';
  }

  // Check for page title uniqueness
  // Note: This would ideally involve a check against other pages, which requires additional setup.
  suggestions.titleUniqueness = 'Ensure this page title is unique compared to other pages on the site.';

  // Check for duplicate content (simplified)
  suggestions.duplicateContent = 'Ensure this content does not duplicate other pages on your site.';

  // Ensure HTTPS is used
  if (!url.startsWith('https://')) {
    suggestions.https = 'Switch to HTTPS for better security and SEO.';
  }

  // Verify presence of Twitter Cards
  const twitterCard = $('meta[name="twitter:card"]').attr('content');
  if (!twitterCard) {
    suggestions.twitterCard = 'Missing Twitter Cards. Consider adding them for better Twitter sharing.';
  }

  // Check if page is mobile-friendly
  suggestions.mobileFriendly = 'Use mobile-friendly layouts for a better user experience on all devices.';

  // Check for minimum font size for accessibility
  const fontSize = $('body').css('font-size');
  if (parseInt(fontSize) < 14) {
    suggestions.fontSize = 'Increase font size to at least 14px for readability.';
  }

  // Check if content is above the fold
  suggestions.aboveTheFold = 'Ensure main content is visible above the fold to improve user experience.';

  // Check for scroll depth tracking (user engagement metric)
  suggestions.scrollTracking = 'Implement scroll depth tracking to monitor user engagement.';

  // Check for 404 error handling
  suggestions.errorHandling = 'Ensure custom 404 error page is set up for broken links.';

  // Check for lazy loading on images
  const lazyImages = $('img[loading="lazy"]').length;
  if (lazyImages < 1) {
    suggestions.lazyLoading = 'Consider adding lazy loading to images for better performance.';
  }

  // Check for third-party scripts impacting load time
  $('script').each((i, script) => {
    const src = $(script).attr('src');
    if (src && (src.includes('facebook') || src.includes('twitter') || src.includes('ads'))) {
      suggestions.thirdPartyScripts = 'Optimize third-party scripts for faster load times.';
    }
  });

  // Placeholder for many other potential parameters
  // Additional checks may involve content reading levels, HTTPS validity, schema depth, etc.

  return suggestions;
}

module.exports = { analyzeSEO };