const axios = require('axios');

async function fetchPageContent(url) {
  try {
    // Start timing the request to measure load time
    const start = Date.now();

    // Ensure the URL is HTTPS
    if (!url.startsWith('https://')) {
      console.warn('Warning: The URL is not using HTTPS, which can impact SEO.');
    }

    // Configure axios with a timeout for quicker responses
    const config = {
      timeout: 5000, // Set a timeout of 5 seconds
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36'
      }
    };

    // Fetch the data
    const { data, status } = await axios.get(url, config);

    // Check for a successful response (status code 200)
    if (status !== 200) {
      console.error(`Error: Received status code ${status}`);
      return null;
    }

    const loadTime = Date.now() - start;
    console.log(`Page loaded in ${loadTime} ms`);

    return { html: data, loadTime };
  } catch (error) {
    console.error(`Error fetching the URL: ${error.message}`);
    return null;
  }
}

// Fetch multiple pages concurrently (if necessary)
async function fetchMultiplePages(urls) {
  const fetchPromises = urls.map(url => fetchPageContent(url));
  return Promise.all(fetchPromises);
}

module.exports = { fetchPageContent, fetchMultiplePages };
