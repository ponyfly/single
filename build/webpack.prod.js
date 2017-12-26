const merge = require('webpack-merge')
const path = require('path')
const baseConfig = require('./webpack.base')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyjsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
// const CopyPlugin = require('copy-webpack-plugin')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')

function resolve(dir) {
  return path.resolve(__dirname, '..', dir)
}

module.exports = merge(baseConfig, {
  output: {
    path: resolve('dist'),
    filename: 'static/js/[name].[chunkhash:8].js',
    publicPath: '/'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {loader: 'css-loader'},
            {loader: 'postcss-loader'}
          ],
          publicPath:'/'
        }),
      },
    ]
  },
  plugins: [
    //创建一个在编译时可以配置的全局常量
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    //根据html模板生成index.html
    new HtmlPlugin({
      template: resolve('app/index.html'),
      filename: 'index.html',
      inject: true
    }),
    //复制静态文件
    // new CopyPlugin([
    //   {
    //     from: resolve('static'),
    //     to: 'static/css/',
    //     ignore: ['.*']
    //   }
    // ]),
    //根据代码内容生成hash作为模块下标
    new webpack.HashedModuleIdsPlugin(),
    //压缩js
    new UglifyjsPlugin({
      sourceMap: true,
      uglifyOptions: {
        compress: true,
        warnings: false
      }
    }),
    //提取css
    new ExtractTextPlugin({
      filename: 'static/css/[name].[contenthash:8].css'
    }),
    //压缩css并删除重复样式
    new OptimizeCssPlugin(),
    //抽取公共js到vender中
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vender',
      minChunks: function (module, count) {
        //// 声明公共的模块来自node_modules文件夹
        return module.resource && (/\.js$/).test(module.resource) && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
      }
    }),
    //上面虽然已经分离了第三方库,每次修改编译都会改变vendor的hash值，导致浏览器缓存失效。原因是vendor包含了webpack在打包过程中会产生一些运行时代码，运行时代码中实际上保存了打包后的文件名。当修改业务代码时,业务代码的js文件的hash值必然会改变。一旦改变必然会导致vendor变化。vendor变化会导致其hash值变化
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vender'] //从vender中抽取
    })
  ]
})