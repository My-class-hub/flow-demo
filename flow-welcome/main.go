package main

import (
	"flow-welcome/config"
	"flow-welcome/middleware"
	"flow-welcome/routers"
	"github.com/kataras/iris/v12"
)

func main() {
	// 创建一个干净的服务
	app := iris.New()
	globalConfig := config.GlobalConfig()
	app.Use(middleware.Cors())           // 跨域
	app.Use(middleware.Recover())        // 统一异常处理
	app.AllowMethods(iris.MethodOptions) // 必须要允许该方法,才能完成跨域
	// 路由注册
	routers.RegisterRouters(app)
	// 启动服务
	_ = app.Listen(globalConfig.Server.Port)

}
