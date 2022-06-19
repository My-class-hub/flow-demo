package model

import (
	"flow-welcome/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var flowDBModel *repository.FlowDBModel

func init() {
	flowDBModel = repository.InitFlowDBModel()
}

func CreateFlow(flow repository.Flow[primitive.ObjectID]) (string, error) {
	return flowDBModel.InsertOne(flow)
}
func SelectFlowsByUserId(userid string) (interface{}, error) {
	return flowDBModel.SelectFlowsByUserId(userid)
}

func SaveFlowById(flow repository.Flow[string]) error {
	return flowDBModel.SaveFlowById(flow)
}

func SelectFlowsDataById(fid string) (string, *repository.FlowTemp, error) {
	id, _ := primitive.ObjectIDFromHex(fid)
	return flowDBModel.SelectFlowsDataById(id)
}

func UpdateFileURL(fid, filepath string) error {
	id, _ := primitive.ObjectIDFromHex(fid)
	return flowDBModel.UpdateFileURL(id, filepath)
}
