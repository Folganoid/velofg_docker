package models

import "github.com/user/velofggorest/config"

type Tire struct {
	Id     uint64
	Name   string
	Userid uint64
}

func (Tire) TableName() string {
	return config.Setup()["db_prefix"]+"tire"
}

func NewTire(
	id uint64,
	name string,
	userid uint64,
) *Tire {

	return &Tire{id, name, userid}

}
