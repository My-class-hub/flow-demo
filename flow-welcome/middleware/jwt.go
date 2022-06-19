package middleware

import (
	"flow-welcome/config"
	"flow-welcome/constant"
	"flow-welcome/utils"
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/jwt"
	"strings"
	"time"
)

type JwtClaims struct {
	Id       interface{} `json:"_id,omitempty" bson:"_id,omitempty"`
	Username string      `json:"username,omitempty" bson:"username,omitempty"`
	Roles    []string    `json:"roles,omitempty" bson:"roles,omitempty"`
}

const Bearer = "Bearer "

var signer []byte // 限定32位数
var maxAge time.Duration

func init() {
	// 初始化配置文件
	jwtConfig := config.GlobalConfig().Jwt
	signer = []byte(jwtConfig.Signer)
	maxAge = time.Duration(jwtConfig.MaxAge)
}

func CreateJwt[T interface{} | JwtClaims](claims T) (string, error) {
	newSigner := jwt.NewSigner(jwt.HS256, signer, maxAge*time.Second)
	sign, err := newSigner.Sign(claims)
	if err != nil {
		return "", err
	}
	return string(sign), err
}

// Token 每次请求检验即可，不需要放入阻塞队列中
func Token(ctx iris.Context) {

	token := ctx.Request().Header.Get("Authorization")
	if strings.Contains(token, Bearer) {
		subIndex := len(Bearer)
		comToken := token[subIndex:]
		// 对comToken解析
		verify, err := jwt.Verify(jwt.HS256, signer, []byte(comToken))
		if err != nil {
			ctx.Application().Logger().Error(err)
			switch err.Error() {
			case "jwt: token expired":
				panic(utils.Error{
					ErrCode: constant.ERROR_JWT_EXPIRE,
					ErrMsg:  constant.ReturnErrMsg(constant.ERROR_JWT_EXPIRE),
				})
			default:
				panic(utils.Error{
					ErrCode: constant.ERROR_JWT_WRONG,
					ErrMsg:  constant.ReturnErrMsg(constant.ERROR_JWT_WRONG),
				})
			}
		}
		var jwtClaim JwtClaims

		err = verify.Claims(&jwtClaim)
		ctx.Values().Set("access_token", jwtClaim)
	} else {
		panic(utils.Error{
			ErrCode: constant.ERROR_JWT_TYPE_WRONG,
			ErrMsg:  constant.ReturnErrMsg(constant.ERROR_JWT_TYPE_WRONG),
		})
	}

	ctx.Next()
}
