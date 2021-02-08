const path = require('path');
const { merge } = require('webpack-merge');
const { HotModuleReplacementPlugin } = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const { PROJECT_PATH, SOURCE_DIR, WEBPACK, DEV_HOST, DEV_PORT } = require('./rsrc.config.js');

const DEV_SERVER = 'webpack-dev-server/client?http://' + DEV_HOST + ':' + DEV_PORT;
const HOT_SERVER = 'webpack/hot/only-dev-server';


module.exports = merge(WEBPACK, {
  entry: Object.keys(WEBPACK.entry).reduce((memo, key) => {
    memo[key] = [DEV_SERVER, HOT_SERVER, WEBPACK.entry[key]];
    return memo;
  }, {}),

  output: {
    filename: '[name]-r3p1ac3ha5h.js',
    publicPath: 'http://' + DEV_HOST + ':' + DEV_PORT + '/static/js/',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]-[local]-[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },

  devtool: 'cheap-module-eval-source-map',

  plugins: [
    new ESLintPlugin({
      context: 'src',
      extensions: [ 'tsx', 'ts', 'jsx', 'js' ],
    }),
    new StyleLintPlugin(),
    new HotModuleReplacementPlugin(),
  ],

  devServer: {
    host: DEV_HOST,
    port: DEV_PORT,
    sockPort: DEV_PORT,
    contentBase: path.join(PROJECT_PATH, 'src'),
    historyApiFallback: true,
    hot: true,
    stats: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
});
