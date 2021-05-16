const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

const getFileName = (ext = '[ext]', name = '[name]') => {
  return isDevelopment ? `${name}.${ext}` : `${name}.[contenthash].${ext}`;
};

module.exports = {
  entry: path.resolve(__dirname, 'src/index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  context: path.resolve(__dirname, 'src'),
  devtool: isDevelopment ? 'source-map' : false,
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@src': path.resolve(__dirname, 'src/'),
    },
  },
  optimization: isDevelopment
    ? {}
    : { minimize: true, minimizer: [new OptimizeCssAssetsWebpackPlugin()] },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        loader: require.resolve('babel-loader'),
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          isDevelopment
            ? 'style-loader'
            : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: path.resolve(__dirname, 'dist/css'),
                },
              },

          {
            loader: 'css-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    port: 3005,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      inject: true,
      minify: {
        removeComments: !isDevelopment,
        removeAttributeQuotes: !isDevelopment,
      },
    }),
    new MiniCssExtractPlugin({
      filename: `./css/${getFileName('css')}`,
      chunkFilename: getFileName('css', '[id]'),
      ignoreOrder: false,
    }),
    new CleanWebpackPlugin(),
  ],
};
