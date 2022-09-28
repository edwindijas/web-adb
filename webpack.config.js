const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  return {
    entry: './src/index.ts',
    plugins:[
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './src/adb',
            to: 'adb'
          }
        ]
      })
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    mode: 'development',
    target: "node",
    resolve: {
      extensions: ['.ts', '.js'],
    }
  }
}
