package repository

import (
	"context"
	"flow-welcome/datasource"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type User[T int | interface{}] struct {
	Id       T      `json:"_id,omitempty" bson:"_id,omitempty"` // 映射mongodb的_id
	Username string `json:"username" bson:"username"`
	Password string `json:"password" bson:"password"`
}

// UserDBModel 保存user对应的集合
type UserDBModel struct {
	collection *mongo.Collection
}

func InitUserDBModel() *UserDBModel {
	collection := datasource.Default().Collection("flow_user")
	// 创建根据名称的唯一索引
	var open bool = true
	_, _ = collection.Indexes().CreateOne(context.TODO(), mongo.IndexModel{
		Keys:    bson.D{{"username", 1}},
		Options: &options.IndexOptions{Unique: &open},
	})
	return &UserDBModel{collection: collection}
}

func (receiver UserDBModel) InsertOne(user User[interface{}]) (interface{}, error) {
	res, err := receiver.collection.InsertOne(context.TODO(), &user)
	if err != nil {
		return nil, err
	}
	return res.InsertedID, err
}

func (receiver UserDBModel) SelectByUsername(username string) (*User[interface{}], error) {
	var user User[interface{}]
	err := receiver.collection.FindOne(context.TODO(), bson.D{{"username", username}}).Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, err
}
