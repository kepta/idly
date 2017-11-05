const HtmlWebpackPlugin = require('html-webpack-plugin');
let CircularDependencyPlugin = require('circular-dependency-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');
var DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
var webpack = require('webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const fs = require('fs');
const path = require('path');
const srcpath = path.resolve(__dirname, 'src/');
const dir = fs
  .readdirSync(srcpath)
  .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory());
const alias = {};

for (var f of dir) {
  alias[f] = path.resolve(__dirname, 'src/' + f + '/');
}

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },

  // Enable sourcemaps for debugging webpack's output.
  // devtool: 'hidden-source-map',
  devtool: 'eval',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      ...alias,
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      antd: path.resolve('./node_modules/antd'),
      'idly-common': path.resolve('./node_modules/idly-common'),
      lodash: path.resolve('./node_modules/lodash'),
      immutable: path.resolve('./node_modules/immutable'),
      ramda: path.resolve('./node_modules/ramda')
    }
  },
  node: {
    fs: 'empty'
  },

  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      async: true,
      minChunks: 2
      // (Modules must be shared between 3 entries)

      // chunks: ["pageA", "pageB"],
      // (Only use these entries)
    }),
    new DuplicatePackageCheckerPlugin({
      // Also show module that is requiring each duplicate package
      verbose: true,
      // Emit errors instead of warnings
      emitError: false
    }),
    new HtmlWebpackPlugin({
      title: 'Development',
      hash: true,
      filename: 'index.html',
      template: 'public/index.html'
    }),

    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: true
    })
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
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      }
    ]
  }
};
