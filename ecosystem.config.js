module.exports = {
	apps: [
		{
			name: "drama-cliq-api",
			script: "./app.js",
			watch: "../mw-store-api/",
			watch_options: {
				followSymlinks: false,
				usePolling: true,
			},
			interpreter: "/home/shreyas/.nvm/versions/node/v20.11.1/bin/node",
			watch: true,
			env: {
				NODE_ENV: "development",
				APP_URL: "http://drama-cliq-api",
			},
			env_production: {
				NODE_ENV: "production",
				APP_URL: "http://your_domain",
			},
		},
	],
};
