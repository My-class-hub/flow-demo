package repository

import (
	"context"
	"flow-welcome/datasource"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type Role[T int | interface{}] struct {
	Id       T      `json:"_id,omitempty" bson:"_id,omitempty"` // 映射mongodb的_id
	RoleName string `json:"role_name" bson:"role_name"`
	UserId   string `json:"user_id" bson:"user_id"`
}
type RoleDBModel struct {
	collection *mongo.Collection
}

func InitRoleDBModel() *RoleDBModel {
	collection := datasource.Default().Collection("flow_roles")
	return &RoleDBModel{collection: collection}
}

func (receiver RoleDBModel) SelectByUserId(userId interface{}) ([]Role[interface{}], error) {
	cursor, err := receiver.collection.Find(context.TODO(), bson.D{{"user_id", userId}})
	if err != nil {
		return nil, err
	}
	// 声明角色权限
	var roles []Role[interface{}]
	// 关闭游标
	defer cursor.Close(context.TODO())
	for cursor.Next(context.TODO()) {
		var role Role[interface{}]
		_ = cursor.Decode(&role)
		roles = append(roles, role)
	}
	return roles, err
}

func (receiver RoleDBModel) InsertOnePermission(userId interface{}) error {
	_, err := receiver.collection.InsertOne(context.TODO(), bson.M{"role_name": "ordinary", "user_id": userId})
	if err != nil {
		return err
	}
	return nil
}
