# e926 Bot

This project is a bot designed to interact with the e926 website and send them to Telegram and in the future, Discord.

## Note
This is very rough MVP done in one evening! Things might (and should) change in the future!

## Features

- Customizable tags, blacklists and fuzzy tags
- Configurable telegram options
- Can display media as embeds, or as direct uploads

## Requirements

- Node.js
- Docker (Optional)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/KarpF1sh/e926reposte.git
    ```
2. Navigate to the project directory:
    ```sh
    cd e621_fav_bot
    ```

### Docker

- Build the docker container:
    ```sh
    docker-compose build
    ```

### Cli

- Install the dependencies:
    ```sh
    npm install
    ```

## Configuring

1. Configure the telegram bot:
    https://core.telegram.org/#bot-api
    (If you want the bot to send messages to a channel, give the proper permissions to it through BotFather)


2. Rename the `.env.rename` to `.env` and fill out the tokens:

    ```
    TELEGRAM_BOT_TOKEN=
    TELEGRAM_CHANNEL_ID=
    ```

3. IMPORTANT Configure the user-agent header in the `src/config.ts` file:
    ```ts
    // Header for the request
    const reqHeaders = {
        'User-Agent': 'MyProject/1.0 (by username on e621)',
        'Content-Type': 'application/json',
    };
    ```

3. Configure your tags in the `src/config.ts` file:
    Refer to the Docs: https://e926.net/wiki_pages/9169
    ```ts
    // Will not include posts with these tags
    const blacklist: string[] = [

    ];

    // Will only include posts with these tags
    const whitelist: string[] = [

    ];

    // These tags may or may not be present in the post
    // Use these to increase the variety of posts
    // Wildcards DO NOT work
    const fuzzyTags: string[] = [

    ];
    ```

## Running

### Docker
1. Start the docker container:
    ```sh
    docker-compose build
    ```

#### Stopping

```sh
docker-compose down
```

### CLI

1. Build the bot:
    ```sh
    npm run build
    ```

2. Run the bot:
    ```sh
    npm run start
    ```

3. OR Run the dev script:
     ```sh
    npm run dev
    ```

## Scheduling

To schedule the bot to run at specific intervals, you can modify the interval in `src/config.ts`. Please keep the interval over 5 minutes! Nobody likes spam, especially e926's & Telegrams servers!
Read their docs to get their rate limits!!

Example:
```ts
// Interval
const interval: number = 1000 * 60 * 10 // 10 minutes
```

## Contributing

Contributions are welcome! This is a **VERY** work in progress project! Please open an issue or submit a pull request.

## TODO

- Implement better post customization and configuration
- Discord webhook/bot option
- Improve api calls
- ...more
