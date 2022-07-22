import React from 'react';
import SETUP from "../config";
import axios from 'axios';

/**
 * Add data
 */
class Data extends React.Component {

    constructor(props) {

        let bikeList = (localStorage.getItem('bikeList')) ? JSON.parse(localStorage.getItem('bikeList')) : [];
        let tireList = (localStorage.getItem('tireList')) ? JSON.parse(localStorage.getItem('tireList')) : [];
        let yearDistList = (localStorage.getItem('yearDistList')) ? JSON.parse(localStorage.getItem('yearDistList')) : [];
        let addBike = (bikeList.length > 0) ? bikeList[0].Name : "";
        let addYDBike = (bikeList.length > 0) ? bikeList[0].Name : "";
        let addTire = (tireList.length > 0) ? tireList[0].Name : "";

        super(props);
        this.state = {
            bikeList: bikeList,
            tireList: tireList,
            yearDistList: yearDistList,
            addBike: addBike,
            addTire: addTire,
            addYDBike: addYDBike,

            statYear: (new Date()).getFullYear(),
            statMonth: (new Date()).getMonth() + 1,
            statDay: (new Date()).getDate(),
            statPrim: "",

            statDist: 0,
            statHr: 0,
            statMin: 0,
            statSec: 0,

            statAsf: 0,
            statTvp: 0,
            statGrn: 0,
            statBzd: 0,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.fillLists = this.fillLists.bind(this);
        this.saveBikeAjax = this.saveBikeAjax.bind(this);
        this.saveTireAjax = this.saveTireAjax.bind(this);
        this.saveYearDist = this.saveYearDist.bind(this);
        this.deleteYD = this.deleteYD.bind(this);
        this.saveStat = this.saveStat.bind(this);
        this.validate = this.validate.bind(this);
        this.validate_date = this.validate_date.bind(this);

        if (!localStorage.getItem('bikeList') || !localStorage.getItem('tireList') || !localStorage.getItem('yearDistList')) {
            this.fillLists();
        }
    }

    /**
     * fill yearstat, tires, bikes
     */
    fillLists() {

        let formData = new FormData();
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);

        let that = this;

        // get bike list
        axios({
            method: 'post',
            url: SETUP.goHost + '/bike',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            localStorage.setItem('bikeList', JSON.stringify(response.data));
            that.setState({bikeList: response.data});
            if (response.data[0].Name !== undefined) {
                that.setState({addBike: response.data[0].Name});
                that.setState({addYDBike: response.data[0].Name});
            }

        }).catch((error) => {
            if (error.response) {
                that.props.done("Bike list not found!", "uk-alert-warning");
            }
        });

        // get tire list
        axios({
            method: 'post',
            url: SETUP.goHost + '/tire',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {

            localStorage.setItem('tireList', JSON.stringify(response.data));
            that.setState({tireList: response.data});

            if (response.data[0].Name !== undefined) {
                that.setState({addTire: response.data[0].Name});
            }

        }).catch((error) => {
            if (error.response) {
                that.props.done("Tire list not found!", "uk-alert-warning");
            }
        });

        // get year-dist list
        axios({
            method: 'post',
            url: SETUP.goHost + '/year_dist',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {

            localStorage.setItem('yearDistList', JSON.stringify(response.data));
            that.setState({yearDistList: response.data});

        }).catch((error) => {
            if (error.response) {
                that.props.done("Year-dist list not found!", "uk-alert-warning");
            }
        });
    }

    /**
     * Input data
     * @param event
     */
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    validate( ...args) {

        let surf = +this.state.statAsf + +this.state.statTvp + +this.state.statBzd + +this.state.statGrn;
        let date = this.validate_date(+this.state.statYear, +this.state.statMonth - 1, +this.state.statDay);

        for(let arg in args) {
            if (!args[arg]) return false;
        }

        if (surf === 100 && date) {
            return true;
        }
        return false;
    }

    validate_date(y, m, d)
    {
        var dt = new Date(y, m, d);
        if ((dt.getFullYear() === y) && (dt.getMonth() === m) && (dt.getDate() === d)) {
            return true;
        } else {
            return false;
        }
    }


    /**
     * [saveBikeAjax description]
     * @return {[type]} [description]
     */
    saveBikeAjax() {

        let formData = new FormData();
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);
        formData.append('bike', this.state.addBike);

        let that = this;

        axios({
            method: 'PUT',
            url: SETUP.goHost + '/bike',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.fillLists();
        }).catch((error) => {
            if (error.response) {
                that.props.done("Error! Can't save bike.", "uk-alert-warning");
            }
        });
    }

    /**
     * [saveTireAjax description]
     * @return {[type]} [description]
     */
    saveTireAjax() {
        
        let formData = new FormData();
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);
        formData.append('tire', this.state.addTire);

        let that = this;

        axios({
            method: 'PUT',
            url: SETUP.goHost + '/tire',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.fillLists();
        }).catch((error) => {
            if (error.response) {
                that.props.done("Error! Can't save ride statistic.", "uk-alert-warning");
            }
        });
    }

    /**
     * [saveYearDist description]
     * @return {[type]} [description]
     */
    saveYearDist() {
        
        let formData = new FormData();
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);
        formData.append('year', this.state.addYDYear);
        formData.append('bike', this.state.addYDBike);
        formData.append('dist', this.state.addYDDist);

        let that = this;

        axios({
            method: 'PUT',
            url: SETUP.goHost + '/year_dist',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.fillLists();
        }).catch((error) => {
            if (error.response) {
                that.props.done("Error! Can't save year distance.", "uk-alert-warning");
            }
        });
    }

    /**
     * Save data
     */
    saveStat() {

        let formData = new FormData();
        let windForm = (this.state.statWindspd === undefined || this.state.statWinddir === 5) ? "" : this.state.statWinddir + "@" + this.state.statWindspd;
        let temp = (this.state.statTemp === undefined) ? "" : this.state.statTemp;
        let prim = (this.state.statPrim === undefined) ? "" : this.state.statPrim;
        let teh = (this.state.statTeh === undefined) ? "" : this.state.statTeh;

        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);
        formData.append('bike', this.state.addBike);
        formData.append('tire', this.state.addTire);
        formData.append('date', (new Date(this.state.statYear, this.state.statMonth - 1, this.state.statDay)).getTime() / 1000);
        formData.append('time', +this.state.statHr*3600 + +this.state.statMin*60 + +this.state.statSec);
        formData.append('dist', this.state.statDist);
        formData.append('prim', prim);
        formData.append('maxspd', this.state.statMaxspd);
        formData.append('maxpls', this.state.statMaxpls);
        formData.append('avgpls', this.state.statAvgpls);
        formData.append('asf', this.state.statAsf);
        formData.append('tvp', this.state.statTvp);
        formData.append('grn', this.state.statGrn);
        formData.append('bzd', this.state.statBzd);
        formData.append('temp', temp);
        formData.append('teh', teh);
        formData.append('wind', windForm);

        let that = this;

        axios({
            method: 'POST',
            url: SETUP.goHost + '/stat',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.props.done("Data saved successfully.", "uk-alert-primary");
            localStorage.clear();
        }).catch((error) => {
            if (error.response) {
                that.props.done("Error! Can't save ride statistic.", "uk-alert-warning");
            }
        });
    }

    /**
     * [deleteYD description]
     * @param  {[type]} id   [description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    deleteYD(id, path) {
        
        let formData = new FormData();
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);
        formData.append('id', id);

        let that = this;

        axios({
            method: 'DELETE',
            url: SETUP.goHost + path,
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.fillLists();
        }).catch((error) => {
            if (error.response) {
                that.props.done("Error! Can't delete year data.", "uk-alert-warning");
            }
        });
    }

     /**
     * render
     * @returns {*}
     */
    render() {

    let delYearDist = (event) => {
        this.deleteYD(event.target.value, "/year_dist");
    }

    let delTire = (event) => {
        this.deleteYD(event.target.value, "/tire");
    }

    let delBike = (event) => {
        this.deleteYD(event.target.value, "/bike");
    }

    let sumSurface = +this.state.statAsf + +this.state.statTvp + +this.state.statBzd + +this.state.statGrn;
    let avgSpeed = this.state.statDist / (+this.state.statSec + +this.state.statMin*60 + +this.state.statHr*60*60)*3600;

    let validate_date = this.validate_date(+this.state.statYear, +this.state.statMonth - 1, +this.state.statDay);
    let validate_time = (this.state.statHr > 0 || this.state.statMin > 0 || this.state.statSec > 0) ? true : false;
    let validate_dist = this.state.statDist > 0;
    let validate_desc = this.state.statPrim !== "";
    let validate_bike_tire = this.state.addBike.length !== "" && this.state.addTire.length !== "";

    let validate = this.validate(validate_date, validate_time, validate_dist, validate_bike_tire);

    let day = +this.state.statDay;
    let month = +this.state.statMonth;

        return (
            <div className="uk-container">
                <h1>Data control</h1>
                <div className="uk-grid">
                    <div className="uk-width-1-2@m uk-width-1-1@s">
                    <h3>Add ride data</h3>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Bike:</td>
                                        <td>
                                            <select name="addBike" onChange={this.handleInputChange}>
                                                {this.state.bikeList.map(function(val, index){
                                                    return <option key={ index } value={val.Name}>{val.Name}</option>;
                                                })}
                                            </select>
                                        </td>
                                    </tr>
                                     <tr>
                                        <td>Tires:</td>
                                        <td>
                                            <select name="addTire" onChange={this.handleInputChange}>
                                                {this.state.tireList.map(function(val, index){
                                                    return <option key={ index } value={val.Name}>{val.Name}</option>;
                                                })}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr className={(validate_date) ? "" : "invalid_stat_data"}>
                                        <td>Date:</td>
                                        <td>
                                            <select value={day} name="statDay" onChange={this.handleInputChange}>
                                                {[...Array(31)].map((x, i) =>
                                                   <option key={ i+1 } value={ i+1 }>{ i+1 }</option>
                                                )}
                                            </select>
                                            <select value={month} name="statMonth" onChange={this.handleInputChange}>
                                                {[...Array(12)].map((x, i) =>
                                                   <option key={ i } value={ i+1 }>{ i+1 }</option>
                                                )}
                                            </select>
                                            <select name="statYear" onChange={this.handleInputChange}>
                                                {[...Array(10)].map((x, i) =>
                                                   <option key={ i } value={ +(new Date()).getFullYear() - i }>{ +(new Date()).getFullYear() - i }</option>
                                                )}
                                            </select>&nbsp;
                                            <span style={{color: "red"}}>{(validate_date) ? "" : "invalid date"}</span>
                                        </td>
                                    </tr>
                                    <tr className={(validate_time) ? "" : "invalid_stat_data"}>
                                        <td>Time:</td>
                                        <td>
                                            <select name="statHr" onChange={this.handleInputChange}>
                                                {[...Array(25)].map((x, i) =>
                                                   <option key={ i } value={ i }>{ i }</option>
                                                )}
                                            </select>h,
                                            <select name="statMin" onChange={this.handleInputChange}>
                                                {[...Array(60)].map((x, i) =>
                                                   <option key={ i } value={ i }>{ i }</option>
                                                )}
                                            </select>m,
                                            <select name="statSec" onChange={this.handleInputChange}>
                                                {[...Array(60)].map((x, i) =>
                                                   <option key={ i } value={ i }>{ i }</option>
                                                )}
                                            </select>s
                                        </td>
                                    </tr>
                                    <tr className={(validate_dist) ? "" : "invalid_stat_data"}>
                                        <td>Dist: </td>
                                        <td>
                                            <input type="text" name="statDist" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr><td>Average speed: </td><td><span style={{display: (avgSpeed > 0 && avgSpeed < Infinity) ? "" : "none"}}>{avgSpeed.toFixed(2)}</span></td></tr>
                                    <tr className={(validate_desc) ? "" : "invalid_stat_data"}>
                                        <td>Description: </td>
                                        <td>
                                            <input type="text" name="statPrim" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Maximum speed: </td>
                                        <td>
                                            <input type="text" name="statMaxspd" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Average pulse: </td>
                                        <td>
                                            <input type="text" name="statAvgpls" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Maximum pulse: </td>
                                        <td>
                                            <input type="text" name="statMaxpls" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr className={(sumSurface === 100) ? "" : "invalid_stat_data"}>
                                        <td>Asphalte: </td>
                                        <td>
                                            <input type="text" size={3} name="statAsf" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr className={(sumSurface === 100) ? "" : "invalid_stat_data"}>
                                        <td>Bad asphalte: </td>
                                        <td>
                                            <input type="text" size={3} name="statTvp" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr className={(sumSurface === 100) ? "" : "invalid_stat_data"}>
                                        <td>Country: </td>
                                        <td>
                                            <input type="text" size={3} name="statGrn" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr className={(sumSurface === 100) ? "" : "invalid_stat_data"}>
                                        <td>Offroad: </td>
                                        <td>
                                            <input type="text" size={3} name="statBzd" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{color: (sumSurface === 100) ? "green" : "red"}}>{sumSurface}</td>
                                    </tr>
                                    <tr>
                                        <td>Temperature: </td>
                                        <td>
                                            <input type="text" name="statTemp" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Wind: </td>
                                        <td>
                                            <input type="text" size="4" name="statWindspd" onChange={this.handleInputChange}/>&nbsp;
                                            <select name="statWinddir" onChange={this.handleInputChange}>
                                                <option value={5}></option>
                                                <option value={8}>⇡</option>
                                                <option value={9}>↗</option>
                                                <option value={6}>⇢</option>
                                                <option value={3}>↘</option>
                                                <option value={2}>⇣</option>
                                                <option value={1}>↙</option>
                                                <option value={4}>⇠</option>
                                                <option value={7}>↖</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Technical notice: </td>
                                        <td>
                                            <input type="textarea" name="statTeh" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button type="button" onClick={this.saveStat} disabled={(validate) ? false : true}>Save</button>
                    </div>
                    <div className="uk-width-1-2@m uk-width-1-1@s">
                        <h3>Add bike</h3>
                            <input id="add_bike" name="addBike" type="text" placeholder="Enter bike" onChange={this.handleInputChange}/>
                            &nbsp;<button className="uk-button-mini uk-button-primary" id="save_bike" type="button" onClick={this.saveBikeAjax}>Add bike</button>
                            <br />
                            <div style={{overflow: "auto", maxHeight: "5.5em"}}>
                                <table width="90%"><tbody>
                                    {this.state.bikeList.map(function(val, index){
                                        return <tr><td width="90%" key={ index }><b>{val.Name}</b></td><td align="right" width="10%"><button title={"delete " + val.Name} className="uk-button-mini uk-button-danger" value={val.Id} onClick={delBike}>X</button></td></tr>;
                                    })}
                                </tbody></table>
                            </div>
                        <h3>Add tires</h3>
                            <input id="add_tire" type="text" name="addTire" placeholder="Enter tire" onChange={this.handleInputChange}/>

                            &nbsp;<button className="uk-button-mini uk-button-primary" id="save_tire" type="button" onClick={this.saveTireAjax}>Add tire</button>
                            <br />
                            <div style={{overflow: "auto", maxHeight: "7.2em"}}>
                                <table width="90%"><tbody>
                                {this.state.tireList.map(function(val, index){
                                    return <tr><td key={ index }><b>{val.Name}</b></td><td width="10%" align="right"><button title={"delete " + val.Name} className="uk-button-mini uk-button-danger" value={val.Id} onClick={delTire}>X</button></td></tr>;
                                })}
                                </tbody></table>
                            </div>

                        <h3>Add year distantion</h3>
                            Bike: <select name="addYDBike" onChange={this.handleInputChange}>
                                     {this.state.bikeList.map(function(val, index){
                                         return <option key={ index } value={val.Name}>{val.Name}</option>;
                                     })}
                                     </select>
                        <br />
                        <input size="4" type="text" name="addYDYear" placeholder="Year" onChange={this.handleInputChange}/>&nbsp;/&nbsp;
                        <input size="10" type="text" name="addYDDist" placeholder="Dist" onChange={this.handleInputChange} />
                        &nbsp;<button className="uk-button-mini uk-button-primary" type="button" onClick={this.saveYearDist}>Add</button>

                            <div style={{overflow: "auto", maxHeight: "8.5em"}}>
                            <table width="90%">
                                <tbody>
                                    {this.state.yearDistList.map(function(val, index){
                                        return <tr key={ index }><td width="10%"><b className="colorblue">{val.Year}</b></td><td width="50%"><b>{val.Bike}</b></td><td align="right" width="20%"><b className="colorred">{val.Dist + " km"}</b></td><td align="right" width="10%"><button  title={"delete " + val.Year + " / " + val.Bike} className="uk-button-mini uk-button-danger" value={val.Id} onClick={delYearDist}>X</button></td></tr>;
                                    })}
                                </tbody>
                            </table>
                            </div>
                    </div>
                </div>
                <br />
            </div>
        );
    }

}

export default Data