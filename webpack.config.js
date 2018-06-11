const path = require('path');
const FlowPlugin = require('flow-babel-webpack-plugin');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'none';

const plugins = ['transform-runtime', 'add-module-exports', new FlowPlugin()];

if (process.env.NODE_ENV === 'test') {
  plugins.push('istanbul');
}

module.exports = {
  mode,
  entry: ['./lib/progressive-table.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['babel-preset-env'],
          plugins
        }
      }
    ]
  },
  devtool: 'source-map'
};
