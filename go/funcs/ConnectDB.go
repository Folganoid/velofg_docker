package funcs

import (
	_ "github.com/jinzhu/gorm/dialects/mysql"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/jinzhu/gorm"
	"fmt"
	"github.com/kataras/iris"
	"github.com/user/velofggorest/config"
)

func ConnectDB(ctx iris.Context) *gorm.DB {

	setup := config.Setup()

	db, err := gorm.Open("postgres", "host=" + setup["db_host"] + " port="+ setup["db_port"] +" user="+ setup["db_user"] +" dbname="+setup["db_name"]+" password="+setup["db_pass"] +" sslmode=disable")
	//db, err := gorm.Open("mysql", setup["db_user"] + ":" + setup["db_pass"] + "@/" + setup["db_name"] + "?charset=utf8")
	if err != nil {
		fmt.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		ctx.WriteString(err.Error())
	}

	return db
}

func ConnectDB2(ctx iris.Context) *gorm.DB {

	setup := config.Setup()

	//db, err := gorm.Open("postgres", "host=" + setup["db_host"] + " port="+ setup["db_port"] +" user="+ setup["db_user"] +" dbname="+setup["db_name"]+" password="+setup["db_pass"] +" sslmode=disable")
	db, err := gorm.Open("mysql", setup["db_user2"] + ":" + setup["db_pass2"] + "@/" + setup["db_name2"] + "?charset=utf8")
	if err != nil {
		fmt.Println(err)
		ctx.StatusCode(iris.StatusInternalServerError)
		ctx.WriteString(err.Error())
	}

	return db
}
