package v1

import (
	"crypto/md5"
	"encoding/hex"
	"errors"
	"flow-welcome/constant"
	_ "flow-welcome/datasource"
	"flow-welcome/middleware"
	"flow-welcome/model"
	"flow-welcome/repository"
	"flow-welcome/utils"
	"github.com/kataras/iris/v12"
)

// User 声明接收数据体
type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// Login 接收登入json参数，因为我懒所以不加验证码了
func Login(ctx iris.Context) {
	var user User
	// 这一步是参数传入的校验一般可以通过别的手段来处理
	if err := ctx.ReadJSON(&user); err != nil {
		panic(utils.Error{
			ErrCode: 500,
			ErrMsg:  constant.ReturnErrMsg(4000),
		})
	} else {
		// 登入操作
		if userModel, err := model.UserLogin(user.Username); err != nil {
			panic(utils.Error{
				ErrCode: 500,
				ErrMsg:  constant.ReturnErrMsg(500),
			})
		} else {
			// 登入校验
			if err := check(userModel, user.Password); err != nil {
				panic(utils.Error{
					ErrCode: 500,
					ErrMsg:  err.Error(),
				})
			} else {
				roles, _ := model.RoleCollection(userModel.Id)
				token, _ := middleware.CreateJwt[middleware.JwtClaims](
					middleware.JwtClaims{
						Id:       userModel.Id,
						Username: userModel.Username,
						Roles:    roles,
					})
				_, _ = ctx.JSON(iris.Map{
					"err_code":     0,
					"err_msg":      constant.ReturnErrMsg(0),
					"_id":          userModel.Id,
					"username":     userModel.Username,
					"permission":   roles,
					"access_token": token,
				})
			}
		}
	}
}

// 因为代码量少所以懒得封装
func check(userModel *repository.User[interface{}], password string) error {
	passwordOld := []byte(password)
	md := md5.New()
	md.Write(passwordOld)
	encodePassword := hex.EncodeToString(md.Sum(nil))
	if encodePassword != userModel.Password {
		return errors.New("账号或密码错误,请重新输入")
	} else {
		return nil
	}
}

// Register 用户注册
func Register(ctx iris.Context) {
	var user User
	if err := ctx.ReadJSON(&user); err != nil {
		panic(utils.Error{
			ErrCode: 500,
			ErrMsg:  constant.ReturnErrMsg(4000),
		})
	} else {
		// 对密码加密
		password := []byte(user.Password)
		md := md5.New()
		md.Write(password)
		encodePassword := hex.EncodeToString(md.Sum(nil)) // 这里的Sum函数可以加盐，这里我不加盐了
		if _, err := model.UserRegister(repository.User[interface{}]{
			Username: user.Username,
			Password: encodePassword,
		}); err != nil {
			panic(utils.Error{
				ErrCode: 500,
				ErrMsg:  "该账号已被注册，请重新操作",
			})
		} else {
			_, _ = ctx.JSON(utils.Error{
				ErrCode: 0,
				ErrMsg:  "账号注册成功，请登入",
			})
		}
	}
}

// Info 获取用户信息
func Info(ctx iris.Context) {
	claim := (ctx.Values().Get("access_token")).(middleware.JwtClaims)
	_, _ = ctx.JSON(iris.Map{
		"err_code":   0,
		"err_msg":    constant.ReturnErrMsg(0),
		"_id":        claim.Id,
		"username":   claim.Username,
		"permission": claim.Roles,
	})
}
