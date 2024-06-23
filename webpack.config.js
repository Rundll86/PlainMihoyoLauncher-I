const path = require("path");
module.exports = {
    entry: "./script/src/script.ts",
    output: {
        filename: "dist.js",
        path: path.join(__dirname, "script/dist"),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/i,
                use: "ts-loader"
            }
        ]
    },
    mode: "development",
    resolve: {
        extensions: [".ts"]
    }
};