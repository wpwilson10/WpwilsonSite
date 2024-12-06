// mostly based on https://webpack.js.org/guides/production/

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const Dotenv = require("dotenv-webpack");

module.exports = merge(common, {
	// sets process.env.NODE_ENV to ‘development’ and enable useful names for modules and chunks. It will also enable the inline-source-map option for debugging.
	mode: "development",
	// maps the compiled code back to your original source code, so you can easily locate errors and warning
	devtool: "inline-source-map",
	plugins: [
		// use the dev.env development configuration file
		new Dotenv({
			path: "./dev.env",
		}),
	],
});
