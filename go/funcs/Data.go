package funcs

import (
	"github.com/user/velofggorest/models"
	"fmt"
	"github.com/kataras/iris"
	"strconv"
)

/**
Get year statistic by usaer Id
*/
func GetYear(ctx iris.Context) {

	check := CheckUser(&ctx, ctx.FormValue("userid"), ctx.FormValue("token"))

	checkAllow := uint64(0)
	if len(ctx.FormValue("foreign")) > 0 {
		checkAllow = CheckAllowStat(&ctx, ctx.FormValue("foreign"))
	}

	if !check && checkAllow == 0 {
		ctx.StatusCode(401)
		ctx.WriteString("SYSTEM Error Access denied 401")
		return
	}

	db := ConnectDB(ctx)
	defer db.Close()

	userId, _ := strconv.ParseUint(ctx.FormValue("userid"), 10, 64)
	if checkAllow > 0 {
		userId = checkAllow
	}

	years := []models.YearDist{}
	db.Where("userid = ?", userId).Order("year desc").Find(&years)

	fmt.Println(ctx.JSON(years))
}

/**
Get statistic by user Id
*/
func GetStat(ctx iris.Context) {

	checkAllow := uint64(0)

	if len(ctx.FormValue("foreign")) > 0 {
		checkAllow = CheckAllowStat(&ctx, ctx.FormValue("foreign"))
	}

	check := CheckUser(&ctx, ctx.FormValue("userid"), ctx.FormValue("token"))

	if !check && checkAllow == 0 {
		ctx.StatusCode(401)
		ctx.WriteString("SYSTEM Error Access denied 401")
		return
	}

	db := ConnectDB(ctx)
	defer db.Close()

	userId, _ := strconv.ParseUint(ctx.FormValue("userid"), 10, 64)
	if checkAllow > 0 {
		userId = checkAllow
	}

	stats := []models.Stat{}
	db.Where("userid = ?", userId).Order("date desc").Find(&stats)

	fmt.Println(ctx.JSON(stats))
}

/**
 * [Bike description]
 * @param {[type]} ctx iris.Context [description]
 */
func Bike(ctx iris.Context) {

	check := CheckUser(&ctx, ctx.FormValue("userid"), ctx.FormValue("token"))

	if !check {
		ctx.StatusCode(401)
		ctx.WriteString("SYSTEM Error Access denied 401")
		return
	}

	db := ConnectDB(ctx)
	defer db.Close()

	// POST
	if ctx.Method() == "POST" {

		bikes := []models.Bike{}
		db.Where("userid = ?", ctx.FormValue("userid")).Find(&bikes)
		fmt.Println(ctx.JSON(bikes))
	}

	// PUT
	if ctx.Method() == "PUT" {
		if len(ctx.FormValue("bike")) > 0 {

			userId, _ := strconv.ParseUint(ctx.FormValue("userid"), 10, 64)
			bike := models.NewBike(0, ctx.FormValue("bike"), userId)
			db.Create(&bike)

			fmt.Println(db.NewRecord(bike))
		}
	}

	// DELETE
	if ctx.Method() == "DELETE" {

		id, _ := strconv.ParseUint(ctx.FormValue("id"), 10, 64)

		bike := models.NewBike(id, "", 0)
		db.Delete(&bike)
	}
}

/**
 * [Tire description]
 * @param {[type]} ctx iris.Context [description]
 */
func Tire(ctx iris.Context) {

	check := CheckUser(&ctx, ctx.FormValue("userid"), ctx.FormValue("token"))

	if !check {
		ctx.StatusCode(401)
		ctx.WriteString("SYSTEM Error Access denied 401")
		return
	}

	db := ConnectDB(ctx)
	defer db.Close()

	// PUT
	if ctx.Method() == "PUT" {
		if len(ctx.FormValue("tire")) > 0 {

			userId, _ := strconv.ParseUint(ctx.FormValue("userid"), 10, 64)
			tire := models.NewTire(0, ctx.FormValue("tire"), userId)
			db.Create(&tire)

			fmt.Println(db.NewRecord(tire))
		}
	}

	// POST
	if ctx.Method() == "POST" {
		tires := []models.Tire{}
		db.Where("userid = ?", ctx.FormValue("userid")).Find(&tires)
		fmt.Println(ctx.JSON(tires))
	}

	// DELETE
	if ctx.Method() == "DELETE" {

		id, _ := strconv.ParseUint(ctx.FormValue("id"), 10, 64)

		tire := models.NewTire(id, "", 0)
		db.Delete(&tire)
	}

}

/**
 * [YearDist description]
 * @param {[type]} ctx iris.Context [description]
 */
func YearDist(ctx iris.Context) {

	check := CheckUser(&ctx, ctx.FormValue("userid"), ctx.FormValue("token"))

	if !check {
		ctx.StatusCode(401)
		ctx.WriteString("SYSTEM Error Access denied 401")
		return
	}

	db := ConnectDB(ctx)
	defer db.Close()

	// POST
	if ctx.Method() == "POST" {

		yearList := []models.YearDist{}
		db.Where("userid = ?", ctx.FormValue("userid")).Order("year desc", true).Find(&yearList)

		fmt.Println(ctx.JSON(yearList))
	}

	// PUT
	if ctx.Method() == "PUT" {

		userId, _ := strconv.ParseUint(ctx.FormValue("userid"), 10, 64)
		year, _ := strconv.ParseUint(ctx.FormValue("year"), 10, 64)
		dist, _ := strconv.ParseFloat(ctx.FormValue("dist"), 64)

		yearDist := models.NewYearDist(0, userId, year, ctx.FormValue("bike"), dist)
		db.Create(&yearDist)

		//fmt.Println(db.NewRecord(yearDist))
	}

	// DELETE
	if ctx.Method() == "DELETE" {

		id, _ := strconv.ParseUint(ctx.FormValue("id"), 10, 64)
		yearDist := models.NewYearDist(id, 0, 0, "", 0)
		db.Delete(&yearDist)
	}
}

/**
 * [Stat description]
 */
func Stat(ctx iris.Context) {

	check := CheckUser(&ctx, ctx.FormValue("userid"), ctx.FormValue("token"))

	if !check {
		ctx.StatusCode(401)
		ctx.WriteString("SYSTEM Error Access denied 401")
		return
	}

	db := ConnectDB(ctx)
	defer db.Close()

	// DELETE
	if ctx.Method() == "DELETE" {

		userId, _ := strconv.ParseUint(ctx.FormValue("userid"), 10, 64)
		id, _ := strconv.ParseUint(ctx.FormValue("id"), 10, 64)

		s := models.Stat{}
		db.Where("id = ? AND userId =?", id, userId).Find(&s)

		if userId != s.Userid {
			ctx.StatusCode(401)
			ctx.WriteString("SYSTEM Error Access denied 401")
			return
		}
		db.Delete(&s)
	}

	// POST
	if ctx.Method() == "POST" || ctx.Method() == "PUT" {

		userId, _ := strconv.ParseUint(ctx.FormValue("userid"), 10, 64)
		dist, _ := strconv.ParseFloat(ctx.FormValue("dist"), 64)
		time, _ := strconv.ParseUint(ctx.FormValue("time"), 10, 64)
		maxspd, _ := strconv.ParseFloat(ctx.FormValue("maxspd"), 64)
		avgpls, _ := strconv.ParseUint(ctx.FormValue("avgpls"), 10, 64)
		maxpls, _ := strconv.ParseUint(ctx.FormValue("maxpls"), 10, 64)
		date, _ := strconv.ParseUint(ctx.FormValue("date"), 10, 64)
		surfasf, _ := strconv.ParseUint(ctx.FormValue("asf"), 10, 64)
		surftvp, _ := strconv.ParseUint(ctx.FormValue("tvp"), 10, 64)
		surfgrn, _ := strconv.ParseUint(ctx.FormValue("grn"), 10, 64)
		srfbzd, _ := strconv.ParseUint(ctx.FormValue("bzd"), 10, 64)
		id, _ := strconv.ParseUint(ctx.FormValue("id"), 10, 64)
		teh := ctx.FormValue("teh")

		if ctx.Method() == "PUT" && id > 0 && dist > 0 && time > 0 && len(ctx.FormValue("bike")) > 0 && len(ctx.FormValue("tire")) > 0 && (surfasf+surftvp+surfgrn+srfbzd == 100) && len(ctx.FormValue("prim")) > 0 {

			s := models.Stat{}
			db.Where("id = ? AND userId =?", id, userId).Find(&s)

			if userId != s.Userid {
				ctx.StatusCode(401)
				ctx.WriteString("SYSTEM Error Access denied 401")
				return
			}

			stat := models.NewStat(id, dist, time, ctx.FormValue("bike"), maxspd, avgpls, maxpls, ctx.FormValue("tire"), date, surfasf, surftvp, surfgrn, srfbzd, ctx.FormValue("prim"), teh, ctx.FormValue("temp"), ctx.FormValue("wind"), userId)
			db.Save(stat)
		} else if ctx.Method() == "POST" && dist > 0 && time > 0 && len(ctx.FormValue("bike")) > 0 && len(ctx.FormValue("tire")) > 0 && (surfasf+surftvp+surfgrn+srfbzd == 100) && len(ctx.FormValue("prim")) > 0 {
			stat := models.NewStat(0, dist, time, ctx.FormValue("bike"), maxspd, avgpls, maxpls, ctx.FormValue("tire"), date, surfasf, surftvp, surfgrn, srfbzd, ctx.FormValue("prim"), teh, ctx.FormValue("temp"), ctx.FormValue("wind"), userId)
			db.Create(&stat)
		} else {
			ctx.StatusCode(404)
			ctx.WriteString("Bad data")
			return
		}
	}
}
