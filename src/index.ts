import TelegramBot from 'node-telegram-bot-api';
import { getTagRandom, sendPostToChannel } from './apis';
import { whitelist, blacklist, scoreRange, fuzzyTags, botToken, channelId, interval } from './config';
import { Post } from './interfaces';

// Main function
async function main() {
    // Ensure the tokens are available
    if (!botToken || !channelId) { // Import botToken and channelId from config.ts
        throw new Error('Bot token or channel ID is missing in .env file');
    }

    // Create a new Telegram bot
    const bot = new TelegramBot(botToken, {polling: false});

    // Fetch and send a post every interval
    setInterval(async () => {
        try {
            const post: Post = await getTagRandom(whitelist, blacklist, fuzzyTags, scoreRange);
            await sendPostToChannel(post, bot);
        } catch (error) {
            console.error('Error fetching or sending post:', error);
        }
    }, interval);
}

main();