// mostly based on https://webpack.js.org/guides/production/

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const Dotenv = require("dotenv-webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
	// enables various optimizations for the code, such as tree shaking, code splitting, minification, etc.
	mode: "production",
	//  generates separate source map files for debugging the minimized code which is preferred for live projects
	devtool: "source-map",
	plugins: [
		// use the dev.env development configuration file
		new Dotenv({
			path: "./prod.env",
		}),
		// Compresses files to improve loading performance
		new CompressionPlugin(),
	],
	// options to further improve loading and performance
	optimization: {
		minimize: true,
		minimizer: [
			// Extracts CSS into separate files. It creates a CSS file per JS file which contains CSS
			new CssMinimizerPlugin(),
			//  removes comments, makes variable names smaller, and removes whitespace
			new TerserPlugin(),
		],
	},
});
