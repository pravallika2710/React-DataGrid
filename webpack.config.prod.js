const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  mode: "production",
  devtool: "source-map",
  devServer: {
    static: path.join(__dirname, "./build"),
    port: 8001,
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
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
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
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  debug: false, // Output the targets/plugins used when compiling

                  // Configure how @babel/preset-env handles polyfills from core-js.
                  // https://babeljs.io/docs/en/babel-preset-env
                  useBuiltIns: "usage",

                  // Specify the core-js version. Must match the version in package.json
                  corejs: 3,

                  // Specify which environments we support/target for our project.
                  // (We have chosen to specify targets in .browserslistrc, so there
                  // is no need to do it here.)
                  // targets: "",
                },
              ],

              "@babel/preset-react",
            ],
          },
        },
      },
    ],
  },
};
