const cheerio = require('cheerio');

function calculateKeywordDensity(html, keyword) {
  const $ = cheerio.load(html);
  const text = $('body').text();
  const totalWords = text.split(/\s+/).length;
  const keywordOccurrences = (text.match(new RegExp(`\\b${keyword}\\b`, 'gi')) || []).length;
  const density = ((keywordOccurrences / totalWords) * 100).toFixed(2);

  return density;
}

module.exports = { calculateKeywordDensity };
