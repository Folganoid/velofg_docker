package models

import "github.com/user/velofggorest/config"

type Stat struct {
	Id      uint64
	Dist    float64
	Time    uint64
	Bike    string
	Maxspd  float64
	Avgpls  uint64
	Maxpls  uint64
	Tires   string
	Date    uint64
	Surfasf uint64
	Surftvp uint64
	Surfgrn uint64
	Srfbzd  uint64
	Prim    string
	Teh     string
	Temp    string
	Wind    string
	Userid  uint64
}

func (Stat) TableName() string {
	return config.Setup()["db_prefix"]+"statdata"
}

func NewStat(
	id uint64,
	dist float64,
	time uint64,
	bike string,
	maxspd float64,
	avgpls uint64,
	maxpls uint64,
	tires string,
	date uint64,
	surfasf uint64,
	surftvp uint64,
	surfgrn uint64,
	srfbzd uint64,
	prim string,
	teh string,
	temp string,
	wind string,
	userid uint64,
) *Stat {

	return &Stat{
		id,
		dist,
		time,
		bike,
		maxspd,
		avgpls,
		maxpls,
		tires,
		date,
		surfasf,
		surftvp,
		surfgrn,
		srfbzd,
		prim,
		teh,
		temp,
		wind,
		userid,
	}
}
