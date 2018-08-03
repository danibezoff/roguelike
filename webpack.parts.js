const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurifyCssPlugin = require('purifycss-webpack')
const CleanPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

exports.minifyJs = () => ({
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  }
})

exports.clean = () => ({
  plugins: [
    new CleanPlugin([
      'dist'
    ])
  ]
})

exports.splitInChunks = () => ({
  optimization: {
    splitChunks: {
      chunks: 'initial',
    },
    runtimeChunk: {
      name: 'manifest'
    }
  },
})

exports.generateProdSourceMaps = () => ({
  devtool: 'source-map'
})

exports.generateDevSourceMaps = () => ({
  devtool: 'cheap-module-inline-source-map'
})

exports.transpileJs = () => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  }
})

exports.copyImagesAndFonts = () => ({
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]'
          }
        }
      }
    ]
  }
})

exports.purifyCss = ({paths}) => ({
  plugins: [
    new PurifyCssPlugin({
      paths,
      minimize: true
    })
  ]
})

exports.extractCss = () => ({
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(s|sa)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')()
              ]
            }
          },
          'sass-loader'
        ]
      }
    ]
  }
})

exports.devServer = ({host, port} = {}) => ({
  devServer: {
    stats: 'errors-only',
    overlay: true,
    open: true,
    host,
    port
  }
})

exports.loadCss = ({include, exclude} = {}) => ({
  module: {
    rules: [
      {
        test: /\.(c|sa)ss$/,
        include,
        exclude,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'sass-loader'
        ]
      }
    ]
  }
})
