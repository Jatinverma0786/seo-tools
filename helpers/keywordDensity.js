const cheerio = require('cheerio');

function calculateKeywordDensity(html, keyword) {
  // Load the HTML content
  const $ = cheerio.load(html);

  // Extract text from the body and clean up unnecessary spaces
  const text = $('body').text().replace(/\s+/g, ' ').trim();
  
  // Edge case: if there is no text or keyword provided
  if (!text || !keyword) {
    return 0; // No content or keyword, return 0 density
  }

  // Normalize keyword (case insensitive matching)
  const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'gi');

  // Total word count
  const totalWords = text.split(/\s+/).length;

  // Count the occurrences of the keyword
  const keywordOccurrences = (text.match(keywordRegex) || []).length;

  // Calculate keyword density as a percentage
  const density = totalWords > 0 ? ((keywordOccurrences / totalWords) * 100).toFixed(2) : 0;

  return density;
}

module.exports = { calculateKeywordDensity };
