module.exports = {
    publicPath: '/admin/',
    runtimeCompiler: true,
    css: {
        loaderOptions: {
            sass: {
                implementation: require("sass")
            }
        }
    }
};
