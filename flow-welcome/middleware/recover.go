package middleware

import (
	"flow-welcome/utils"
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/context"
)

/** 统一异常处理中间件 **/

func Recover() iris.Handler {
	return func(ctx *context.Context) {
		defer func() {
			// 如果存在异常,则修复异常
			if err := recover(); err != nil {
				// 如果停止直接中断遍历
				if ctx.IsStopped() {
					return
				}
				// 判断异常类型
				switch err.(type) {
				case utils.Error:
					u := err.(utils.Error)
					// 200保证非系统500错误
					_ = ctx.StopWithJSON(200, &u)
				}
				// 打印错误信息
				ctx.Application().Logger().Warn(err)
			}
		}()

		ctx.Next()
	}
}
