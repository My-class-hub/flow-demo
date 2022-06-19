package routers

import (
	v1 "flow-welcome/api/v1"
	"flow-welcome/middleware"
	"github.com/kataras/iris/v12"
)

// RegisterRouters 传递指针作为路由的注册
func RegisterRouters(app *iris.Application) {
	// 开放路由
	public := app.Party("api/v1")
	{
		public.Post("/user/login", v1.Login)
		public.Post("/user/register", v1.Register)
		public.Get("/flow/preview/:file", v1.Preview)
	}
	// 鉴权路由
	private := app.Party("api/v1")
	private.Use(middleware.Token)
	{
		private.Get("/user/info", v1.Info)
		private.Post("/flow/create", v1.Create)
		private.Get("/flow/list", v1.SelectFlowsByUserId)
		private.Put("/flow/save", v1.FlowSaveById)
		private.Get("/flow/chart/{fid}", v1.SelectFlowById)
		private.Post("/flow/upload", v1.UploadFlow)
	}
}
