import * as dotenv from 'dotenv';

// Load .env file
dotenv.config();

// Header for the request
const reqHeaders = {
    'User-Agent': 'e6Reposter/1.0 (by undelete on e621)', // MyProject/1.0 (by username on e621)
    'Content-Type': 'application/json',
};

const siteUrl: string = 'https://e621.net';
//const siteUrl = 'https://e926.net'; // For SFW content

// Will not include posts with these tags
const blacklist: string[] = [
    'guro',
    'death',
    'necrophilia',
    'human',
    'feral',
    'female',
    'breasts',
    'smegma',
    'comic',
];

// Will only include posts with these tags
const whitelist: string[] = [
    '*_muscles',
];

// These tags may or may not be present in the post
// Use these to increase the variety of posts
// Wildcards DO NOT work
const fuzzyTags: string[] = [
    'hyper',
    'macro',
    'big_muscles',
    'huge_muscles',
    'muscular_male',
    'muscle_growth',
];

// Interval
const interval: number = 1000 * 60 * 10 // 10 minutes

//const scoreRange: [number, number? = [100, 1000]; // [Lower bound, upper bound]
const scoreRange: [number, number?] = [100]; // Upper bound optional

// Telegram stuff
// Replace with your own bot token (get it from BotFather on Telegram)
const botToken = process.env.TELEGRAM_BOT_TOKEN;
// Replace with your channel ID (add bot as an admin to the channel)
const channelId = process.env.TELEGRAM_CHANNEL_ID;

export { reqHeaders, siteUrl, blacklist, whitelist, fuzzyTags, scoreRange, botToken, channelId, interval };