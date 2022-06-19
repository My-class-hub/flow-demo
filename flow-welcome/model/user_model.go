package model

import (
	"context"
	"flow-welcome/datasource"
	"flow-welcome/repository"
	"go.mongodb.org/mongo-driver/mongo"
)

// 处理登入请求
var userDBModel *repository.UserDBModel

func init() {
	userDBModel = repository.InitUserDBModel()
}

func UserRegister(user repository.User[interface{}]) (id interface{}, err error) {
	ctx := context.TODO()
	// 这里加事物
	_ = datasource.Default().Client().UseSession(ctx,
		func(sessionContext mongo.SessionContext) error {
			if err := sessionContext.StartTransaction(); err != nil {
				return err
			}
			defer sessionContext.EndSession(ctx)
			defer sessionContext.AbortTransaction(ctx)
			id, err = userDBModel.InsertOne(user)
			err := roleModel.InsertOnePermission(id)
			if err != nil {
				return err
			}
			return sessionContext.CommitTransaction(ctx)
		})

	return id, err
}

func UserLogin(username string) (*repository.User[interface{}], error) {
	return userDBModel.SelectByUsername(username)
}
