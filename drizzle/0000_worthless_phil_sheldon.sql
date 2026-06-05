-- npx drizzle-kit generate

-- npx wrangler d1 execute cloudflare-test-db --file=./drizzle/0000_worthless_phil_sheldon.sql --local

CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
