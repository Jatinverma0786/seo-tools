const { Bot } = require('grammy');
const { fetchPageContent } = require('./helpers/fetchPage');
const { analyzeSEO } = require('./helpers/analyzeSEO');
const { calculateKeywordDensity } = require('./helpers/keywordDensity');

// Replace with your Telegram bot token
const token = 'ENTER YOUR BOT TOKEN';
const bot = new Bot(token);

// Start command to guide the user
bot.command('start', (ctx) => {
  ctx.reply('Welcome to the SEO Analysis Bot! Send me a URL to analyze, or use /help for more options.');
});

// Help command to show bot usage
bot.command('help', (ctx) => {
  ctx.reply(`
    Here are some commands you can use:
    - /analyze <url> [keyword] - Analyze a webpage for SEO.
    - Provide a URL, and optionally, a keyword to check its density.
    - Example: /analyze https://example.com keyword
  `);
});

// Analyze command to trigger SEO analysis
bot.command('analyze', async (ctx) => {
  const input = ctx.message.text.split(' ');
  const url = input[1];
  const keyword = input[2] || null;

  if (!url) {
    return ctx.reply('Please provide a URL to analyze. Example: /analyze https://example.com keyword');
  }

  try {
    const { html, loadTime } = await fetchPageContent(url);
    if (!html) {
      return ctx.reply('Failed to fetch page content. Please check the URL and try again.');
    }

    const seoSuggestions = analyzeSEO(html, url);
    let response = `SEO Suggestions for ${url} (Page Load Time: ${loadTime} ms):\n\n`;

    // Format the SEO suggestions for the user
    for (const [key, message] of Object.entries(seoSuggestions)) {
      response += `${key.toUpperCase()}: ${message}\n`;
    }

    // If keyword is provided, calculate keyword density
    if (keyword) {
      const density = calculateKeywordDensity(html, keyword);
      response += `\nKeyword Density for "${keyword}": ${density}%`;
    }

    // Send the final response to the user
    ctx.reply(response);
  } catch (error) {
    console.error(error);
    ctx.reply('An error occurred while processing your request. Please try again later.');
  }
});

// Start the bot
bot.start();
