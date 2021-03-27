const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const DotEnv = require('dotenv-webpack');

module.exports = {
	// Entry nos permite decir el punto de entrada de nuestra aplicación
	entry: './src/index.js',
	// Output nos permite decir hacia dónde va enviar lo que va a preparar webpacks
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[contenthash].js',
		assetModuleFilename: 'assets/images/[hash][ext][query]',
	},
	mode: 'development',
	watch: true,
	resolve: {
		// Aqui ponemos las extensiones que tendremos en nuestro proyecto y que queremos que webpack reconozca
		extensions: ['.js'],
		// Para poner alias:
		alias: {
			'@utils': path.resolve(__dirname, 'src/utils/'),
			'@templates': path.resolve(__dirname, 'src/templates/'),
			'@styles': path.resolve(__dirname, 'src/styles/'),
			'@images': path.resolve(__dirname, 'src/assets/images/'),
		},
	},
	module: {
		rules: [
			// Aca conectaremos babel con webpack
			{
				test: /\.m?js$/, // utiliza cualquier instruccion que termine con mjs o js
				exclude: /node_modules/, // excluir todo lo que esta dentro de la carpeta node_modules/
				use: {
					loader: 'babel-loader',
				},
			},
			// Aca conectaremos CSS con webpack
			{
				test: /\.css|.styl$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'],
			},
			// Para importar imagenes:
			{
				test: /\.png/,
				type: 'asset/resource',
			},
			// Para trabajar con fonts
			{
				test: /\.(woff|woff2)$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 10000,
						mimetype: 'application/font-woff',
						name: '[name].[contenthash].[ext]',
						outputPath: './assets/fonts/',
						publicPath: '../assets/fonts/',
						esModule: false,
					},
				},
			},
		],
	},
	plugins: [
		// con este plugin webpack crea un html donde injectara el javascript compilado.
		new HtmlWebpackPlugin({
			inject: true,
			template: './public/index.html', // de donde va a leer webpack el html de entrada.
			filename: './index.html', // webpack compilara un nuevo html en la carpeta ./dist
		}),
		// con este plugin webpack usar CSS
		new MiniCssExtractPlugin({
			filename: 'assets/[name].[contenthash].css',
		}),
		new CopyPlugin({
			// Para copiar archivos:
			patterns: [
				{
					from: path.resolve(__dirname, 'src', 'assets/images'), // de donde vamos a copiar
					to: 'assets/images', // a donde vamos a copiar
				},
			],
		}),
		new DotEnv(),
	],
};
