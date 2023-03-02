export default {
    async install(Vue) {
        // 启动初始化程序
        // 注册components全局组件
        console.log("初始化插件")
        const requireComponent = require.context('./module', true, /\.vue$/)
        requireComponent.keys().forEach(fileName => {
            const componentConfig = requireComponent(fileName)
            const componentName = componentConfig.default.name
            if (componentName) {
                Vue.component(componentName, componentConfig.default)
            }
        })

        const requireComponent_js = require.context('./module', true, /\.js$/)
        requireComponent_js.keys().forEach(fileName => {
            const componentConfig = requireComponent_js(fileName)
            const componentName = componentConfig.default.name
            if (componentName) {
                Vue.component(componentName, componentConfig.default)
            }
        })


    }
}