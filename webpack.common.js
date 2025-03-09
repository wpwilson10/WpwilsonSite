// mostly based on https://webpack.js.org/guides/production/

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	// Entry should point to the "root" code file
	entry: "./src/index.tsx",
	output: {
		// Renames files to append a hash string which indicates when the file has changed so clients know to handle the changes
		filename: "[name].[contenthash].js",
		// Where to put the final files.
		path: path.resolve(__dirname, "dist"),
		// Remove existing files from the output path
		clean: true,
	},
	plugins: [
		//  Generates an HTML5 file for you that includes all your files careated by webpack in the head using script tags
		new HtmlWebpackPlugin({
			// The title to use for the generated HTML document
			title: "wpwilson.com",
			// Load our template which includes site specific information like SEO and author
			template: "./public/index.html",
		}),
		// Extracts CSS into separate files. It creates a CSS file per JS file which contains CSS
		new MiniCssExtractPlugin({
			// Renames files to append a hash string which indicates when the file has changed so clients know to handle the changes
			filename: "[name].[contenthash].css",
		}),
		// Copy favicons and other files to dist without modification (the default)
		new CopyPlugin({
			patterns: [
				{ from: "./public/favicons" },
				{ from: "./public/robots.txt" },
				{ from: "./public/site.webmanifest" },
			],
		}),
	],
	// States which files types webpack should act on
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	// configure the rules for loading and parsing different file formats
	module: {
		rules: [
			// standard rule for handling tsx files and excluding external modules
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			// Allow loading images
			// https://webpack.js.org/guides/asset-management/#loading-images and https://stackoverflow.com/a/66251201
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
			},
			// use the MiniCssExtractPlugin for css files instead of the default
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
		],
	},
};
