const {merge} = require('webpack-merge'); // For merging this config // with base.js
const base = require('./webpack.config.base'); // Importing base.js file
const path = require('path'); // Node.js module used to manipulate // file paths
const TerserPlugin = require('terser-webpack-plugin'); // To minify // your JS file in the build folder


module.exports = merge(base, { // Merging this config with base.js // config 
   mode: 'production', // enable webpack's built-in optimizations  // that correspond to production
   output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'public', 'js')
   },
   devtool: false, // We don't need this in our production
   performance: {
      maxEntrypointSize: 900000,
      maxAssetSize: 900000, // These configure the file size limit of your build, webpack send you warnings if it is exceeded
   },
   optimization: {
      minimizer: [
         new TerserPlugin({
            terserOptions: {
               output: {
                  comments: false, // Tell Terser Plugin to remove comments in your minified file
               },
            },
         }),
      ],
   },  
   plugins: [],
});
