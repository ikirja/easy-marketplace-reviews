# Easy-Marketplace-Reviews

Server REST API app to collect reviews from marketplaces. It collects reviews that has been answered from you marketplace account based on created task. When reviews has been collected and saved to local DB, task is marked as completed. Currently supported marketplaces: Wildberries.

## Setup

Make sure to install the dependencies:

```bash
npm install
```

Environment variables should be put in .env file before building for production. See Environment variables section for more information.

## Development Server

Start the development server on `http://localhost:${PORT}`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

## Environment variables

Application is using environment variables. You have to define:

- NODE_ENV (development or production).
- PORT (on which the server will run locally), default: 3000.
- DB (mongodb URI to connect to, example: mongodb://127.0.0.1:27017/name-of-database), default: mongodb://localhost:27017/easy-marketplace-reviews.
- API_KEY (to access application's REST API).
- WB_TOKEN (token from your WB Account with access to feedbacks API).
- WB_FEEDBACKS_URL (url to WB REST API feedbacks endpoint), default: https://feedbacks-api.wildberries.ru/api/v1/feedbacks.
- CRON_TIME_WB_FEEDBACKS (cron time string for wb feedbacks update schedule), default: "*/1 * * * *" (runs every minute).

You can define all needed variables in .env file in root folder of this application.

## Additional information

Easy-Marketplace-Reviews is built on NodeJS (^18.20.2), ExpressJS (^4), MongoDB (^5). Please, before proceed be sure to check official documentation on corresponding technology.

# Copyright

EasyOneWeb LLC 2020 - 2025. All rights reserved. Code author: Kirill Makeev. See LICENSE.md for licensing and usage information.

# TODO Roadmap:

- [ ] Ozon Reviews
- [ ] Proper error handler
- [ ] REST API review response with limits
- [ ] Integrate with Easy-AI-Router: WB Reviews summarization
- [x] REFACTOR to proper libs
- [x] Create task only if there's no unfinished task
- [x] Get All Tasks by desc date
- [x] Ability to mark task as Completed
- [x] Cron task to update reviews
- [x] WB Reviews, get all recursively while saving/updating in DB
- [x] Secret WB Info to env vars
- [x] Cron should only start if previous task has been completed
- [x] Cron should check opened task
- [x] Cron Schedule times in env vars
- [x] Secure REST API with API-KEY
- [x] UPDATE LICENSE.md on usage of this software
