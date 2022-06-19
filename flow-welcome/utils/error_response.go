package utils

type Error struct {
	ErrCode int    `json:"err_code"`
	ErrMsg  string `json:"err_msg"`
}
