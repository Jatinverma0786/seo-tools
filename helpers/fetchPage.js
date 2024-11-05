const axios = require('axios');

async function fetchPageContent(url) {
  try {
    const start = Date.now();

    if (!url.startsWith('https://')) {
      console.warn('Warning: The URL is not using HTTPS, which can impact SEO.');
    }

    const { data } = await axios.get(url);
    const loadTime = Date.now() - start;

    return { html: data, loadTime };
  } catch (error) {
    console.error(`Error fetching the URL: ${error}`);
    return null;
  }
}

module.exports = { fetchPageContent };
