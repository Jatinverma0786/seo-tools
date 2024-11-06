const yargs = require('yargs');
const { fetchPageContent } = require('./helpers/fetchPage');
const { analyzeSEO } = require('./helpers/analyzeSEO');
const { calculateKeywordDensity } = require('./helpers/keywordDensity');

// Set up CLI options with yargs
const argv = yargs
  .option('url', {
    alias: 'u',
    description: 'URL of the page to analyze',
    type: 'string',
    demandOption: true,
    coerce: (url) => {
      // Validate URL format
      const regex = /^(https?:\/\/)[\w.-]+(?:\.[a-z]{2,})+(\/[^\s]*)?$/i;
      if (!regex.test(url)) {
        throw new Error('Invalid URL format. Please provide a valid URL starting with http:// or https://');
      }
      return url;
    },
  })
  .option('keyword', {
    alias: 'k',
    description: 'Keyword to check for density',
    type: 'string',
    demandOption: false,
    default: '',
  })
  .help()
  .alias('help', 'h')
  .argv;

// Async function to run SEO analysis and keyword density check
async function runSEOTool(url, keyword) {
  try {
    console.log(`Fetching content from: ${url}`);
    const { html, loadTime } = await fetchPageContent(url);

    // Check if the content was fetched successfully
    if (!html) {
      console.log('Failed to fetch page content.');
      return;
    }

    console.log(`Page loaded in ${loadTime} ms`);

    console.log('Analyzing SEO...');
    const suggestions = analyzeSEO(html, url);
    console.log('SEO Suggestions:', suggestions);

    if (keyword) {
      console.log(`Analyzing keyword density for: "${keyword}"`);
      const density = calculateKeywordDensity(html, keyword);
      console.log(`Keyword Density for "${keyword}": ${density}%`);
    }
  } catch (error) {
    console.error('Error occurred during SEO analysis:', error.message);
  }
}

// Execute the SEO tool with provided URL and keyword
runSEOTool(argv.url, argv.keyword);
