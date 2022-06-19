package v1

import (
	"flow-welcome/config"
	"flow-welcome/constant"
	"flow-welcome/middleware"
	"flow-welcome/model"
	"flow-welcome/repository"
	"flow-welcome/utils"
	"github.com/kataras/iris/v12"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"mime/multipart"
	"net/url"
	"os"
	"path/filepath"
)

var local = config.GlobalConfig().Local

type FlowFile struct {
	Filename string `json:"filename"`
}

// Create 创建文件夹,这里还需要做一个鉴权的认定，vip可以有无限次，普通用户每天5次
func Create(ctx iris.Context) {
	var flowFile FlowFile
	if err := ctx.ReadJSON(&flowFile); err != nil {
		panic(utils.Error{
			ErrCode: 500,
			ErrMsg:  constant.ReturnErrMsg(4000),
		})
	} else {
		claims := ctx.Values().Get("access_token").(middleware.JwtClaims)
		r := repository.Flow[primitive.ObjectID]{
			UserId:   (claims.Id).(string),
			Filename: flowFile.Filename,
		}
		id, err := model.CreateFlow(r)
		if err != nil {
			panic(utils.Error{
				ErrCode: 500,
				ErrMsg:  constant.ReturnErrMsg(500),
			})
		} else {
			_, _ = ctx.JSON(iris.Map{
				"err_code": 0,
				"err_msg":  constant.ReturnErrMsg(0),
				"file_id":  id,
			})
		}
	}
}

func SelectFlowsByUserId(ctx iris.Context) {
	claims := ctx.Values().Get("access_token").(middleware.JwtClaims)
	flow, err := model.SelectFlowsByUserId((claims.Id).(string))
	if err != nil {
		panic(utils.Error{
			ErrCode: 500,
			ErrMsg:  constant.ReturnErrMsg(500),
		})
	} else {
		_, _ = ctx.JSON(iris.Map{
			"err_code": 0,
			"err_msg":  constant.ReturnErrMsg(0),
			"list":     flow,
		})
	}
}
func FlowSaveById(ctx iris.Context) {
	var flow repository.Flow[string]
	if err := ctx.ReadJSON(&flow); err != nil {
		panic(utils.Error{
			ErrCode: 500,
			ErrMsg:  constant.ReturnErrMsg(4000),
		})
	}
	err := model.SaveFlowById(flow)
	if err != nil {
		panic(utils.Error{
			ErrCode: 500,
			ErrMsg:  constant.ReturnErrMsg(500),
		})
	} else {
		_, _ = ctx.JSON(iris.Map{
			"err_code": 0,
			"err_msg":  constant.ReturnErrMsg(0),
		})
	}
}

func SelectFlowById(ctx iris.Context) {
	fid := ctx.Params().Get("fid")
	filename, obj, _ := model.SelectFlowsDataById(fid)
	_, _ = ctx.JSON(iris.Map{
		"err_code": 0,
		"err_msg":  constant.ReturnErrMsg(0),
		"data":     obj,
		"filename": filename,
	})
}

func UploadFlow(ctx iris.Context) {
	maxSize := local.Cap * iris.MB
	ctx.SetMaxRequestBodySize(maxSize)
	file, header, err := ctx.FormFile("file")
	if err != nil {
		// 错误处理
		ctx.StopWithError(iris.StatusBadRequest, err)
		return
	}
	defer func(file multipart.File) {
		err := file.Close()
		if err != nil {
			return
		}
	}(file)

	fid := ctx.FormValue("fid")
	dest := filepath.Join(local.Path, fid+".png")
	_, err = os.Stat(dest)
	// 如果文件不存在更新数据库
	if err != nil {
		// 通知数据库,这里应该加上事物的
		_ = model.UpdateFileURL(fid, local.Url+fid+".png")
	}
	_, err = ctx.SaveFormFile(header, dest)
	if err != nil {
		ctx.StopWithError(iris.StatusBadRequest, err)
		return
	}
	_, _ = ctx.JSON(iris.Map{
		"err_code": 0,
		"err_msg":  constant.ReturnErrMsg(0),
	})
}

func Preview(ctx iris.Context) {
	file := ctx.Params().Get("file")
	path := filepath.Join(local.Path, file)
	writer := ctx.ResponseWriter()
	defer writer.Flush()
	writer.Header().Set("content-disposition", "inline;filename="+url.QueryEscape(file))
	// 因为图片比较小所以不加缓存
	readFile, err := os.ReadFile(path)
	if err != nil {
		return
	}
	_, _ = writer.Write(readFile)
}
