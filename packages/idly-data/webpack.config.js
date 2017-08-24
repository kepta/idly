const fs = require('fs');
const path = require('path');
const srcpath = path.resolve(__dirname, 'src/');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: __dirname + '/lib',
    library: 'IdlyData',
    libraryTarget: 'commonjs2'
  },

  // Enable sourcemaps for debugging webpack's output.
  // devtool: 'hidden-source-map',
  devtool: 'source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  node: {
    fs: 'empty'
  },

  devServer: {
    contentBase: './dist'
  },
  //   plugins: [new BundleAnalyzerPlugin()],
  module: {
    rules: [
      // {
      //   test: /\.jsx?$/,
      //   enforce: 'pre',
      //   use: ['remove-flow-types-loader'],
      //   include: path.join(__dirname, 'node_modules/mapbox-gl')
      // },
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
    ]
  }
};
