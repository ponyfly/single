const merge = require('webpack-merge')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const os = require('os')

const baseConfig = require('./webpack.base')

let localhost = ''
try {
  const network = os.networkInterfaces()
  localhost = network[Object.keys(network)[0]][1].address
} catch (e) {
  localhost = 'localhost'
}

module.exports = merge(baseConfig, {
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    host: localhost,
    port: 8096,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './app/index.html',
      filename: 'index.html',
      inject: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
  ]
})
