package funcs

import (
	"github.com/kataras/iris"
)

func Routing(app *iris.Application) {

	app.Post("/user", func(ctx iris.Context) { FetchUser(ctx) })
	app.Post("/profupdate", func(ctx iris.Context) { UpdateUser(ctx) })
	app.Post("/reg", func(ctx iris.Context) { RegUser(ctx) })
	app.Post("/get_markers", func(ctx iris.Context) { GetMarkers(ctx) })
	app.Post("/get_foreign_markers", func(ctx iris.Context) { GetForeignMarkers(ctx) })
	app.Post("/get_year_data", func(ctx iris.Context) { GetYear(ctx) })
	app.Post("/get_stat_data", func(ctx iris.Context) { GetStat(ctx) })
	app.Any("/bike", func(ctx iris.Context) { Bike(ctx) })
	app.Any("/tire", func(ctx iris.Context) { Tire(ctx) })
	app.Any("/year_dist", func(ctx iris.Context) { YearDist(ctx) })
	app.Any("/stat", func(ctx iris.Context) { Stat(ctx) })
	app.Any("/marker", func(ctx iris.Context) { Marker(ctx) })
	app.Post("/token", func(ctx iris.Context) { Token(ctx) })

	app.Get("/test", func(ctx iris.Context) { Test(ctx) })
}
