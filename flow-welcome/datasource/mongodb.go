package datasource

import (
	"context"
	"flow-welcome/config"
	"fmt"
	"github.com/kataras/iris/v12"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

// 单例对象
var database *mongo.Database

func init() {
	mongoConfig := config.GlobalConfig().Mongodb
	// 配置mongodb
	ctx, cancel := context.WithTimeout(
		context.TODO(),
		mongoConfig.Timeout*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(
		fmt.Sprintf(
			"mongodb://%s:%s@%s:%s",
			mongoConfig.Username,
			mongoConfig.Password,
			mongoConfig.Host,
			mongoConfig.Port,
		),
	))
	if err != nil {
		iris.New().Logger().Error("mongodb连接失败")
	}
	database = client.Database(mongoConfig.Database)
}

func Default() *mongo.Database {
	return database
}
