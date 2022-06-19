package constant

type codeMapValue = map[int]string

const (
	// 这里的成功应该给0
	SUCCESS = 0
	ERROR   = 500

	// 用户相关模块
	ERROR_JWT_EXIST      = 2000 // jwt不存在
	ERROR_JWT_EXPIRE     = 2001 // jwt过期
	ERROR_JWT_WRONG      = 2003 // jwt错误
	ERROR_JWT_TYPE_WRONG = 2004 // jwt类型错误

	// 资源调用上限
	ERROR_RESOURCE_CAP = 3000

	// 参数校验失败
	ERROR_PARAM_WRONG = 4000
)

// 声明规则

var codeMsg = codeMapValue{
	SUCCESS:              "ok",
	ERROR:                "error",
	ERROR_JWT_EXIST:      "令牌不存在",
	ERROR_JWT_EXPIRE:     "令牌过期",
	ERROR_JWT_WRONG:      "令牌错误",
	ERROR_JWT_TYPE_WRONG: "令牌格式错误",
	ERROR_RESOURCE_CAP:   "资源创建达到上限",
	ERROR_PARAM_WRONG:    "参数校验失败",
}

func ReturnErrMsg(code int) string {
	return codeMsg[code]
}
