# trapBot

Telegram bot for our household.

## Running the bot

We're running the bot with [process manager 2](https://www.npmjs.com/package/pm2)

1. Create `.env` file which contains the bot token (BOT_TOKEN)
2. Deploy the app with pm2, using `pm2 start trapbot.js`
3. You can later update the bot with `npm run deploy`, which pulls the latest version from git and restarts pm2 process

## Features

### Shopping list

- Type something to add items
- `/done` to clear list
- `/list` or `/print` to print full list
- `/remove` to remove individual item

### Fast Speedtest

- Tests download speed with fast-speedtest-api
- `/speed` to get current download speed
- `/average` to get an average of the download speeds
- `/reset` to reset speed history to 0

## Todo

- Add expenses calculator
- `/update` command
- Make remove command easier to use
