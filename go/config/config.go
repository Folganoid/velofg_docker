package config

func Setup() map[string]string {

	setup := make(map[string]string)

	// mysql
	//setup["db_name"] = "go"
	//setup["db_user"] = "fg"
	//setup["db_pass"] = "56195619"
	//setup["db_prefix"] = ""

	//postgres
	setup["db_host"] = "postgres"
	setup["db_port"] = "5432"
	setup["db_user"] = "postgres"
	setup["db_pass"] = "postgres"
	setup["db_name"] = "d8ha2ongbrinnm"
	setup["db_prefix"] = "test."
	setup["frontPath"] = "https://localhost:3000"

	//setup["db_host"] = "ec2-52-44-58-234.compute-1.amazonaws.com"
	//setup["db_port"] = "5432"
	//setup["db_user"] = "jypkngaemutuwp"
	//setup["db_pass"] = "1348390c804bfa32715bd6dadbf74a5e16b2b4927f0f06a422d79ce3e2eee59a"
	//setup["db_name"] = "d8ha2ongbrinnm"
	//setup["db_prefix"] = "test."
	//setup["frontPath"] = "https://velofg.herokuapp.com"

	return setup
}
