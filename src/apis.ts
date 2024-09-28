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

    // Make this a bit more readable and expandable
    const captionParts = [
        //`[ ](${post.url})`,
        `👨‍🎨 ${post.artists.map(artist => `[${artist.replace('_(artist)', '')}](${siteUrl}/posts?tags=${artist.replace(')', '%29').replace('(', '%28')})`).join(', ')}`,
        `🌐 [Link](${siteUrl}/posts/${post.id}) ${post.animated ? 'Animated!' : ''}`,
        `⭐ ${post.score}`,
        `❤️ ${post.favs}`,
        `${ratingEmoji} ${post.rating}`
    ];

    // Optional fields
    if (post.parent_id) {
        captionParts.push(`[Parent](${siteUrl}/posts/${post.parent_id})`);
    }

    if (post.children && post.children.length > 0) {
        const childrenLinks = post.children.map(childId => `[Link](${siteUrl}/posts/${childId})`).join(', ');
        captionParts.push(`Children: ${childrenLinks}`);
    }

    if (post.pools && post.pools.length > 0) {
        const poolLinks = post.pools.map(poolId => `[${poolId}](${siteUrl}/posts/${poolId})`).join(', ');
        captionParts.push(`Pool: ${poolLinks}`);
    }

    const caption = captionParts.join('\n');

    //console.log(caption);

    // Send the post to the channel if it's less than 50 MB
    //console.log(post.sizeMb);

    // If the post is a small gif and not a webm, send it as a video
    // TODO: Telegram won't embed webms, so we should convert them to mp4
    if (post.animated && !post.webm && post.sizeMb < 50) {
        console.log('Sending video...');
        await bot.sendVideo(channelId, post.url, {
            caption: caption,
            parse_mode: 'Markdown'
        });
    } else {
        console.log('Sending photo...');
        await bot.sendPhoto(channelId, post.sampleUrl, {
            caption: caption,
            parse_mode: 'Markdown'
        });
    }

    //await bot.sendMessage(channelId, caption, {parse_mode: 'Markdown'});
}

export { getTagRandom, sendPostToChannel };
