// mostly based on https://webpack.js.org/guides/production/

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const Dotenv = require("dotenv-webpack");
const BrotliPlugin = require("brotli-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
	// enables various optimizations for the code, such as tree shaking, code splitting, minification, etc.
	mode: "production",
	// Provides basic source mapping information while maintaining relatively good performance.
	// DO NOT USE when keeping code obscured is important
	devtool: "cheap-source-map",
	plugins: [
		// use the dev.env development configuration file
		new Dotenv({
			path: "./prod.env",
		}),
		// Compresses files to improve loading performance
		new BrotliPlugin({
			asset: "[path].br[query]", // Naming convention for compressed files
			test: /\.(js|css|html|svg)$/, // Which file types should be compressed
			threshold: 10240, // 3️⃣ Minimum file size before compression (10 KB)
			minRatio: 0.8, // 4️⃣ Compression ratio to apply compression
		}),
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
		splitChunks: {
			chunks: "all",
			minSize: 20000, // Minimum size before splitting
			maxSize: 200000, // Try to keep chunks under 200 KB
		},
	},
});
