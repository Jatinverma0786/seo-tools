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
  })
  .option('keyword', {
    alias: 'k',
    description: 'Keyword to check for density',
    type: 'string',
    demandOption: false,
  })
  .help()
  .alias('help', 'h')
  .argv;

async function runSEOTool(url, keyword) {
  const { html, loadTime } = await fetchPageContent(url);
  if (!html) {
    console.log('Failed to fetch page content.');
    return;
  }

  const suggestions = analyzeSEO(html, url);
  console.log('SEO Suggestions:', suggestions);

  if (keyword) {
    const density = calculateKeywordDensity(html, keyword);
    console.log(`Keyword Density for "${keyword}": ${density}%`);
  }

  console.log(`Page Load Time: ${loadTime} ms`);
}

runSEOTool(argv.url, argv.keyword);
