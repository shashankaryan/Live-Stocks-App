const path = require('path')
const webpack = require('webpack')

module.exports = {
	devtool: 'cheap-eval-source-map',
	context: __dirname,
	entry: ['./js/StockApp.jsx'],
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'bundle.js',
		publicPath: '/public/',
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	},
	stats: {
		colors: true,
		reasons: true,
		chunks: true,
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
			},
		}),
	],
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
			},
		],
	},
}
