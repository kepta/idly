const HtmlWebpackPlugin = require('html-webpack-plugin');
let CircularDependencyPlugin = require('circular-dependency-plugin');

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
  devtool: 'hidden-source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias
  },
  node: {
    fs: 'empty'
  },

  devServer: {
    contentBase: './dist'
  },
  plugins: [
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
