const nodeExternals = require('webpack-node-externals'); 
const path = require('path')    // just add this line

module.exports = {
    entry: {
        main: './app.js'
    },
    output:{
        path: path.join(__dirname, 'dev-build'),
        publicPath: '/',
        filename: '[name].js',
        clean: true
    },
    mode : 'development',
    target: 'node',
    externals: [nodeExternals()],  
    module :{
        rules:[
            {
                test : /\.js$/,
                exclude:  /node_modules/,
                loader: 'babel-loader',
            }
        ]
    } 
}
