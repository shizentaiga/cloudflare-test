-- npx wrangler d1 execute cloudflare-test-db --file=./drizzle/0001_tired_madripoor.sql --local

ALTER TABLE `users` ADD `email` text;