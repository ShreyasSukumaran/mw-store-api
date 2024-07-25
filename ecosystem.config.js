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
			watch: true,
			env: {
				NODE_ENV: "development",
				APP_URL: "http://localhost:5173",
			},
			env_production: {
				NODE_ENV: "production",
				APP_URL: "https://drama-cliq.netlify.app",
			},
		},
	],
};
