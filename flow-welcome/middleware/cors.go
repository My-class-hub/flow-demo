package middleware

import (
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/cors"
)

// Cors /**创建默认跨域中间件**/
func Cors() iris.Handler {
	corsConfig := cors.New()
	// 不需要发送cookie
	corsConfig.DisallowCredentials()
	return corsConfig.Handler()
}
