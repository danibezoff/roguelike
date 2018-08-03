const path = require('path')
const glob = require('glob')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const parts = require('./webpack.parts')

const PATHS = {
  app: path.join(__dirname, 'src')
}

const commonConfig = merge(
  parts.clean(),
  {
    resolve: {
      modules: [
        PATHS.app,
        'node_modules'
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/index.html'
      })
    ]
  },
  parts.copyImagesAndFonts()
)

const devConfig = merge(
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT
  }),
  parts.loadCss()
)

const prodConfig = merge(
  {
    output: {
      chunkFilename: '[name].[chunkhash].js',
      filename: '[name].[chunkhash].js',
    },
  },
  parts.extractCss(),
  parts.purifyCss({
    paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true })
  }),
  parts.transpileJs(),
  parts.minifyJs(),
  parts.splitInChunks()
)

module.exports = mode => {
  if (mode === 'production') {
    return merge(commonConfig, prodConfig, {mode})
  }
  return merge(commonConfig, devConfig, {mode})
}
