const path = require('path')
const yaml =require('yamljs');
const WorkboxPlugin =require('workbox-webpack-plugin');

module.exports={
    entry:'./src/app.js',
    plugins:[
        new WorkboxPlugin.GenerateSW({
            clientsClaim:true,
            skipWaiting:true
        })
    ],
    output:{
        filename:'main.js',
        //ubicacion achivo main.js
        path:path.resolve(__dirname,'dist')
    },

    module:{
        rules:[
            {
                test:/\.css$/i,
                use:['style-loader','css-loader'],
            },
            {
                test:/\.s[ac]ss$/i,
                use:['style-loader','css-loader','sass-loader'],
            },
            {
                test:/\.(png|jpg)$/i,
                type:'asset/resource',
            },
            {
                test:/\.csv$/i,
                use:['csv-loader'],
            },
            {
                test:/\.yaml$/i,
                type:'json',
                use:['csv-loader'],
                parser:{
                    parse:yaml.parse
                }
            },
        ],
    },
};