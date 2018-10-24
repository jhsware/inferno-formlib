const path = require('path')

module.exports = {
  entry: {
    app: path.resolve(__dirname, './src/app.js'),
    appCompat: path.resolve(__dirname, './src/appCompat.js'),
    test: path.resolve(__dirname, './src/test.js')
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          "presets": [
            ["@babel/env", { "modules": false }]
          ],
          "plugins": [
            "@babel/proposal-class-properties",
            "@babel/transform-runtime",
            "@babel/transform-spread",
            "add-module-exports",
            "@babel/syntax-jsx",
            [
              "babel-plugin-inferno",
              {
                "imports": true
              }
            ]
          ]
        }
      }
    }]
  }
}
