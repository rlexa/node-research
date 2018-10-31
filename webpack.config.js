const path = require('path');

module.exports = {
  entry: {
    'hello.server': './src/hello.server'
  }, /* <distName>: <path> */
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  }, /* build every <entry> point as bundle to <path> and rename to <filename> */
  resolve: { extensions: ['.ts', '.js', '.json'] }, /* needed for resolving when no extension provided (e.g. in imports) */
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' } /* all ts files should be handled by ts-loader */
    ]
  },
  devtool: 'source-map', /* for debugging */
  mode: 'development', /* default is production but for server not needed */
  target: 'node' /* needed as default is browser */
};