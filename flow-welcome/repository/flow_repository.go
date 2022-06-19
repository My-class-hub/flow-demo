package repository

import (
	"context"
	"flow-welcome/datasource"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Flow[T int | primitive.ObjectID | string] struct {
	Id         T      `json:"_id,omitempty" bson:"_id,omitempty"` // omitempty如果序列化没有该字段就会不序列化
	UserId     string `json:"user_id,omitempty" bson:"user_id,omitempty"`
	Filename   string `json:"filename,omitempty" bson:"filename,omitempty"`
	PreviewURL string `json:"preview_url" bson:"preview_url,omitempty"`
	Edges      []Edge `json:"edges,omitempty" bson:"edges,omitempty"`
	Nodes      []Node `json:"nodes,omitempty" bson:"nodes,omitempty"`
}

type FlowTemp struct {
	Edges []Edge `json:"edges,omitempty" bson:"edges,omitempty"`
	Nodes []Node `json:"nodes,omitempty" bson:"nodes,omitempty"`
}

type FlowTempVo struct {
	Filename string `json:"filename,omitempty" bson:"filename,omitempty"`
	Edges    []Edge `json:"edges,omitempty" bson:"edges,omitempty"`
	Nodes    []Node `json:"nodes,omitempty" bson:"nodes,omitempty"`
}

// Edge 边声明
type Edge struct {
	EndPoint struct {
		X float32 `json:"x"`
		Y float32 `json:"y"`
	} `json:"endPoint"`
	Id         string `json:"id"`
	PointsList []struct {
		X float32 `json:"x"`
		Y float32 `json:"y"`
	} `json:"pointsList"`
	Properties   interface{} `json:"properties"`
	SourceNodeId string      `json:"sourceNodeId"`
	StartPoint   struct {
		X float32 `json:"x"`
		Y float32 `json:"y"`
	}
	TargetNodeId string `json:"targetNodeId"`
	Type         string `json:"type"`
}
type Node struct {
	Id         string      `json:"id"`
	Properties interface{} `json:"properties"`
	Text       struct {
		Value string  `json:"value"`
		X     float32 `json:"x"`
		Y     float32 `json:"y"`
	} `json:"text"`
	Type string  `json:"type"`
	X    float32 `json:"x"`
	Y    float32 `json:"y"`
}

type FlowDBModel struct {
	collection *mongo.Collection
}

func InitFlowDBModel() *FlowDBModel {
	collection := datasource.Default().Collection("flow_model")
	// 就不设索引了
	return &FlowDBModel{collection: collection}
}

func (receiver FlowDBModel) InsertOne(flow Flow[primitive.ObjectID]) (string, error) {
	res, err := receiver.collection.InsertOne(context.TODO(), &flow)
	if err != nil {
		return "", err
	}
	return res.InsertedID.(primitive.ObjectID).Hex(), err
}

func (receiver FlowDBModel) SelectFlowsByUserId(userid string) (interface{}, error) {
	cursor, err := receiver.collection.Find(context.TODO(), bson.D{{"user_id", userid}})
	if err != nil {
		return nil, err
	}
	var flows []Flow[string]
	defer func(cursor *mongo.Cursor, ctx context.Context) {
		_ = cursor.Close(ctx)
	}(cursor, context.TODO())
	for cursor.Next(context.TODO()) {
		var flow Flow[string]
		_ = cursor.Decode(&flow)
		flows = append(flows, flow)
	}
	return flows, err
}

func (receiver FlowDBModel) SaveFlowById(flow Flow[string]) error {
	id, _ := primitive.ObjectIDFromHex(flow.Id)
	temp := FlowTemp{
		Nodes: flow.Nodes,
		Edges: flow.Edges,
	}
	_, err := receiver.collection.UpdateByID(context.TODO(),
		id,
		bson.M{"$set": &temp})
	if err != nil {
		return err
	}

	return nil
}

func (receiver FlowDBModel) SelectFlowsDataById(id primitive.ObjectID) (string, *FlowTemp, error) {
	var flowTempVo FlowTempVo
	err := receiver.collection.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&flowTempVo)
	if err != nil {
		return "", nil, err
	}
	flowTemp := FlowTemp{
		Nodes: flowTempVo.Nodes,
		Edges: flowTempVo.Edges,
	}

	return flowTempVo.Filename, &flowTemp, nil
}

func (receiver FlowDBModel) UpdateFileURL(id primitive.ObjectID, filepath string) error {
	_, err := receiver.collection.UpdateByID(
		context.TODO(),
		id,
		bson.M{"$set": bson.M{"preview_url": filepath}})
	return err
}
