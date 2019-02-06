const webpack = require("webpack"),
  path = require("path");

module.exports = {
  plugins: [new webpack.IgnorePlugin(/pg-native/)]
};
