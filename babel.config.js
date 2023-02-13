const plugins = []


// 生产环境移除console
if (process.env.NODE_ENV === 'production') {
  plugins.push("transform-remove-console")
}
plugins.push([
  "import",
  {
    libraryName: "vant",
    libraryDirectory: "es",
    style: true,
  },
])
module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: plugins,
};
