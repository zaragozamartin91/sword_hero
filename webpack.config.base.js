const webpack = require('webpack'); // import webpack :)
const path = require('path'); // Node.js module used to manipulate file paths

console.log('BABEL SRC PATH: ', path.resolve(__dirname, 'src/'))

module.exports = { 
   mode: 'development', // enable webpack's built-in optimizations that correspond to development
   entry: './src/index.js',
   output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'public', 'js')
   },
   devtool: 'inline-source-map', // Each module is executed with eval() and a SourceMap is added as a DataUrl to the eval().  Initially it is slow, but it provides fast rebuild speed and yields real files
   module: { 
      rules: [ 
         { 
            test: /\.js$/, // checks for files with .js extension in the path specified below
            include: path.resolve(__dirname, 'src/'), // checks in this path
            exclude: /node_modules/, // exclude node_modules folder
         },
         { 
            test: [/\.vert$/, /\.frag$/],
            use: 'raw-loader',
         }, // in case you need to use Vertex and Fragment shaders, this loader will bundle them for you.
         { 
            test: /\.(gif|png|jpe?g|svg|xml)$/i,
            use: 'file-loader',
         }, // in case you need to use images, this loader will bundle them for you
      ],
   },
   plugins: [
      new webpack.DefinePlugin({
         CANVAS_RENDERER: JSON.stringify(true),
         WEBGL_RENDERER: JSON.stringify(true),
      }), // config webpack to handle renderer swapping in our app
   ],
}
