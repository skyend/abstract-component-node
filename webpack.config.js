var path = require('path');

module.exports = {
    entry: './src/index.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename : 'bundle.js',
        libraryTarget:'umd',
    },

    module: {
        rules : [
            {
                test : /\.js$/,
                exclude : [
                    'node_modules/',
                ],
                include: [
                    path.resolve(__dirname, "src")
                ],
                loader : 'babel-loader',
                options : {
                    presets : ['es2015','es2016','es2017','stage-0'],
                    plugins: ['transform-decorators-legacy']
                }
            }
        ]
    },

}