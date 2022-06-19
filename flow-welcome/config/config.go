package config

import (
	"github.com/kataras/iris/v12"
	"github.com/spf13/viper"
	"time"
)

// Config /** 单例使用 **/
type Config struct {
	Server  *server  `json:"server"`
	Mongodb *mongodb `json:"mongodb"`
	Jwt     *jwt     `json:"jwt"`
	Local   *local   `json:"local"`
}

type server struct {
	Port string `json:"port"`
}
type mongodb struct {
	Host     string        `json:"host"`
	Port     string        `json:"port"`
	Username string        `json:"username"`
	Password string        `json:"password"`
	Database string        `json:"database"`
	Timeout  time.Duration `json:"timeout"`
}
type jwt struct {
	Signer string `json:"signer"`
	MaxAge int    `json:"maxAge"`
}

type local struct {
	Cap  int64  `json:"cap"`
	Path string `json:"path"`
	Url  string `json:"url"`
}

// 单例初始化
var config Config

func init() {
	viper.SetConfigType("yaml")
	viper.SetConfigFile("application.yaml")
	logger := iris.New().Logger()
	logger.Info("读取配置文件......")
	// 读取配置文件
	if err := viper.ReadInConfig(); err != nil {
		logger.Error("文件读取失败......")
		return
	}
	// 文件解码
	if err := viper.Unmarshal(&config); err != nil {
		logger.Error("文件格式异常......")
		return
	}
}

// GlobalConfig 获取配置文件
func GlobalConfig() Config {
	return config
}
