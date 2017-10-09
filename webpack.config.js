const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	target: 'node',
	entry: './server.js',
	output: {
		filename: 'server.js',
		path: path.resolve(__dirname, 'dist')
	},
	node: {
		__dirname: true
	},
	module: {
		rules: [{
			test: /\.js$/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: [
						['env', {
							'targets': {
								uglify: true
							}
						}]
					]
				}
			},
			exclude: /node_modules/
		}]
	},
	externals: [nodeExternals()],
	plugins: [
		new webpack.optimize.UglifyJsPlugin()
	]
};