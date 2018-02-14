const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const browserSync = new BrowserSyncPlugin(
    {
        host: 'localhost',
        port: 3000,
        proxy: 'localhost:8080'
    }
);

const htmlPlugin = new HtmlWebpackPlugin({
    filename: path.resolve(__dirname, 'public/index.html'),
    template: path.resolve(__dirname, 'src/assets/webpack-templates/index.html')
});

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        dev: ['./index.ts', './assets/scss/main.scss'],
        polyfills: ['./polyfills.ts']
    },
    output: {
        publicPath: '/',
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'public')
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader: "sass-loader"}
                ],
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        htmlPlugin
    ]
};
