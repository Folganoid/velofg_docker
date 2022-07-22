package models

import "github.com/user/velofggorest/config"

type YearDist struct {
	Id     uint64
	Userid uint64
	Year   uint64
	Bike   string
	Dist   float64
}

func (YearDist) TableName() string {
	return config.Setup()["db_prefix"]+"yeardata"
}

func NewYearDist(
	id uint64,
	userid uint64,
	year uint64,
	bike string,
	dist float64,
) *YearDist {

	return &YearDist{id, userid, year, bike, dist}

}
