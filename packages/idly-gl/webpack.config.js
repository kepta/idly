let CircularDependencyPlugin = require('circular-dependency-plugin');
var DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
var webpack = require('webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const path = require('path');
const srcpath = path.resolve(__dirname, 'src/');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'idly-gl.js',
    path: __dirname + '/dist',
    library: 'idlygl',
    libraryTarget: 'umd',
  },

  // Enable sourcemaps for debugging webpack's output.
  // devtool: 'hidden-source-map',
  devtool: 'eval',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  node: {
    fs: 'empty',
  },

  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new DuplicatePackageCheckerPlugin({
      // Also show module that is requiring each duplicate package
      verbose: true,
      // Emit errors instead of warnings
      emitError: false,
    }),

    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: true,
    }),
    // new DashboardPlugin()
    // new BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      {
        test: /\.worker\.ts$/,
        use: {
          loader: 'worker-loader',
          options: { inline: true, fallback: false },
        },
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
};
