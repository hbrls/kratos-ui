const path = require('path');
const { merge } = require('webpack-merge');
const AssetsPlugin = require('assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { REV, WEBPACK, NAME, DLL, PROJECT_PATH, TARGET_DIR, PUBLIC_PATH } = require('./rsrc.config.js');


const PROD_CONFIG = merge(WEBPACK, {
  output: {
    filename: '[name]-[chunkhash:5].js',
    chunkFilename: '[name]-[chunkhash:5].js',
    path: path.resolve(PROJECT_PATH, TARGET_DIR, 'dist'),
    publicPath: PUBLIC_PATH,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'thread-loader',
          'babel-loader'
        ],
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]-[local]-[hash:5]',
              },
              importLoaders: 1,
            },
          },
          'postcss-loader'
        ],
      },
    ],
  },

  plugins: [
    new AssetsPlugin({
      processOutput: assets => JSON.stringify(assets).replace(new RegExp(PUBLIC_PATH, 'ig'), ''),
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[hash:5].css',
      chunkFilename: 'chunk-[name]-[hash:5].css',
    }),
  ],

  optimization: {
    minimizer: [
      new TerserJSPlugin({
        sourceMap: false,
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
  },
});


module.exports = PROD_CONFIG;
