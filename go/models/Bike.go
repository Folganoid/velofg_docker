package models

import "github.com/user/velofggorest/config"

type Bike struct {
	Id     uint64
	Name   string
	Userid uint64
}

func (Bike) TableName() string {
	return config.Setup()["db_prefix"]+"ts"
}

func NewBike(
	id uint64,
	name string,
	userid uint64,
) *Bike {

	return &Bike{id, name, userid}

}
