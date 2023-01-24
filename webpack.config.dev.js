const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: path.join(__dirname, "./build"),
    port: 9090,
    open: true,
    historyApiFallback: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    hot: true,
  },
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    filename: "build.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: true,
      template: path.resolve(__dirname, "public", "index.html"),
      favicon: "./public/favicon.ico",
    }),

    new CleanWebpackPlugin(),
    new NodePolyfillPlugin(),
  ],
  resolve: {
    extensions: [".js", ".json", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-nested']
              }
            }
          }
        ]
      },
      {
        test: /\.(xml|config)$/,
        use: ["xml-loader"],
        resourceQuery: { not: [/url/] },
      },
      { test: /\.txt$/, use: "raw-loader" },
      {
        test: /\.(jpg|jpeg|gif|ico|png|config)$/,

        use: [
          {
            loader: "file-loader",
          },

          {
            loader: "image-webpack-loader",
          },
        ],

        // exclude: /node_modules/,
      },

      {
        test: /\.svg$/i,
        type: "asset",
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
        use: ["@svgr/webpack"],
      },

      {
        test: /\.(js|jsx|json)$/,
        exclude: /[\\/]node_modules[\\/]/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env']]
            }
          },
          {
            loader: '@linaria/webpack5-loader',
            options: { preprocessor: 'none' }
          }
        ]
      },
    ],
  },
};
