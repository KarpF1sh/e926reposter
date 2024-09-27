import axios from 'axios';
import {siteUrl, reqHeaders, channelId} from './config';
import {Post} from './interfaces';
import TelegramBot from 'node-telegram-bot-api';

// Function to get a random post with the specified tags
async function getTagRandom(tags: string[], blacklist: string[], fuzzyTags: string[], score?: [number, number?] ): Promise<Post> { // score is optional
    try {
        // Construct the query parameters
        // Sorry for the mess
        const queryParams = [
            `tags=+order:random`,
            ...tags.map(tag => `+${tag}`),
            ...blacklist.map(tag => `+-${tag}`),
            ...fuzzyTags.map(tag => `+~${tag}`),
            score ? `+score:>${score[0]}` : '',
            score && score[1] ? `+score:<${score[1]}` : ''
        ].filter(Boolean).join('');

        // Make the request
        const response = await axios.get(`${siteUrl}/posts.json?${queryParams}`, {
            headers: reqHeaders
        });

        //console.log(response.data.posts[0]);
/*
        if (response.data.posts[0].file.size > 5 * 1024 * 1024) {
            console.log('File size too large, retrying...');
            return getTagRandom(tags, blacklist, fuzzyTags, score);
        }*/

        return new Post(response.data.posts[0]);
    } catch (error) {
        console.error(error);
    }
}

// Function to send a post to a Telegram channel
async function sendPostToChannel(post: Post, bot: TelegramBot){
    // Send the post to the channel
    const ratingEmoji = post.rating === 's' ? '🟢' : post.rating === 'q' ? '🟡' : '🔴';

    const captionParts = [
        `[ ](${post.url})`,
        `👨‍🎨 ${post.artists.map(artist => `[${artist}](${siteUrl}/posts?tags=${artist})`).join(', ')}`,
        `🌐 [Link](${siteUrl}/posts/${post.id}) ${post.animated ? 'Animation!' : ''}`,
        `⭐ ${post.score}`,
        `❤️ ${post.favs}`,
        `${ratingEmoji} ${post.rating}`
    ];

    // Optional fields
    if (post.parent_id) {
        captionParts.push(`[Parent](${siteUrl}/posts/${post.parent_id})`);
    }

    if (post.children && post.children.length > 0) {
        const childrenLinks = post.children.map(childId => `[Child](${siteUrl}/posts/${childId})`).join(', ');
        captionParts.push(`Children: ${childrenLinks}`);
    }

    if (post.pools && post.pools.length > 0) {
        const poolLinks = post.pools.map(poolId => `[${poolId}](${siteUrl}/posts/${poolId})`).join(', ');
        captionParts.push(`Pool: ${poolLinks}`);
    }

    const caption = captionParts.join('\n');

    //console.log(caption);

    // Send the post to the channel
    /*
    await bot.sendPhoto(channelId, post.url, {
        caption: caption,
        parse_mode: 'Markdown'
    });*/

    // If the post is animated, send it as a video
    await bot.sendMessage(channelId, caption, {parse_mode: 'Markdown'});
}

export { getTagRandom, sendPostToChannel };
