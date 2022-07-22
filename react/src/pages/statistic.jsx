import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import SETUP from "../config";
import axios from 'axios';
import * as statFuncs from '../elements/statFuncs';
import YearList from '../elements/yearlist';
import DistStat from '../elements/distStat';
import Calendar from '../elements/calendar';
import StatDataTable from '../elements/dataStatTable';
import TechDataTable from '../elements/dataTechTable';

/**
 * Statistic
 */
class Statistic extends React.Component {

    constructor(props) {

        let yearDataTmp = (localStorage.getItem('yearData')) ? JSON.parse(localStorage.getItem('yearData')) : [];
        let statDataTmp = (localStorage.getItem('statData')) ? JSON.parse(localStorage.getItem('statData')) : [];
        let tiresTmp = (localStorage.getItem('tires')) ? JSON.parse(localStorage.getItem('tires')) : [];
        let yearsTmp = (localStorage.getItem('years')) ? JSON.parse(localStorage.getItem('years')) : [];
        let optionsOdoYearTmp = (localStorage.getItem('optionsOdoYear')) ? JSON.parse(localStorage.getItem('optionsOdoYear')) : [];
        let odoOptionsNamesTmp = (localStorage.getItem('odoOptionsNames')) ? JSON.parse(localStorage.getItem('odoOptionsNames')) : [];
        let curYearTmp = (localStorage.getItem('curYear')) ? JSON.parse(localStorage.getItem('curYear')) : (new Date()).getFullYear();
        let curYearStatTmp = (localStorage.getItem('curYearStat')) ? JSON.parse(localStorage.getItem('curYearStat')) : {};
        let rideDaysArrTmp = (localStorage.getItem('rideDaysArr')) ? JSON.parse(localStorage.getItem('rideDaysArr')) : {};
        let tiresOdoTmp  = (localStorage.getItem('tiresOdo')) ? JSON.parse(localStorage.getItem('tiresOdo')) : {};

        let foreign = (props.match.params.userLoginFor !== undefined && props.match.params.userLoginFor.length > 0) ? props.match.params.userLoginFor : "";

        super(props);
        this.state = {
            odoOptions: statFuncs.odoOptions(),
            odoCommonOptions: statFuncs.odoCommonOptions(),
            odoYearOptions: statFuncs.odoYearOptions(),
            avgPlsOptions: statFuncs.avgPlsOptions(),
            avgSpdOptions: statFuncs.avgSpdOptions(),
            yearData: yearDataTmp,
            statData: statDataTmp,
            tires: tiresTmp,
            years: yearsTmp,
            optionsOdoYear: optionsOdoYearTmp,
            odoOptionsNames: odoOptionsNamesTmp,
            curYear: curYearTmp,
            curYearStat: curYearStatTmp,
            rideDaysArr: rideDaysArrTmp,
            tiresOdo: tiresOdoTmp,
        };

        console.log(props);

        this.getData = this.getData.bind(this);
        this.buildCharts = this.buildCharts.bind(this);
        this.preYear = this.preYear.bind(this);
        this.nextYear = this.nextYear.bind(this);
        this.filterStatDataByYear = this.filterStatDataByYear.bind(this);
        this.buildStatOneYear = this.buildStatOneYear.bind(this);
        this.buildRideDays = this.buildRideDays.bind(this);
        this.getForeignStat = this.getForeignStat.bind(this);
        this.getMyStat = this.getMyStat.bind(this);
        this.reload = this.reload.bind(this);

        if (foreign !=="") {
            this.getData(foreign);
        } else if (yearDataTmp.length === 0 || statDataTmp.length === 0 || tiresTmp.length === 0) {
            this.getData();
        } else {
            this.buildCharts(statDataTmp);
        }
    }

    countTiresOdo(data) {
        let result = {};

        for (let i = 0 ; i < data.length ; i++) {
            if (result[data[i].Tires] === undefined) {
                result[data[i].Tires] = 0;
                result[data[i].Tires + " (asphalt)"] = 0;
                result[data[i].Tires + " (bad asphalt)"] = 0;
                result[data[i].Tires + " (country)"] = 0;
                result[data[i].Tires + " (offroad)"] = 0;
            }
            result[data[i].Tires] += +data[i].Dist;
            result[data[i].Tires + " (asphalt)"] += +data[i].Surfasf / 100 * +data[i].Dist;
            result[data[i].Tires + " (bad asphalt)"] += +data[i].Surftvp / 100 * +data[i].Dist;
            result[data[i].Tires + " (country)"] += +data[i].Surfgrn / 100 * +data[i].Dist;
            result[data[i].Tires + " (offroad)"] += +data[i].Srfbzd / 100 * +data[i].Dist;

        }

        return result;
    }


    buildRideDays(data, year) {

        let result = {};

        for(let d = 0 ; d < data.length; d++) {
            let date = new Date(data[d].Date * 1000);
            if (date.getFullYear() !== year) continue;
            if (result[date.getMonth()] === undefined) result[date.getMonth()] = {};
            result[date.getMonth()][date.getDate()] = data[d].Id;
        }

        return result;
    }

    /**
     * build chart options
     */
    buildCharts(data) {

        let years = statFuncs.getYearsList(this.state.yearData, data);
        let optionsOdoYear = statFuncs.getOdoBikeList(this.state.yearData, data);
        let odoOptionsNames = statFuncs.makeOdoOptions(optionsOdoYear, years);

        localStorage.setItem('years', JSON.stringify(years));
        localStorage.setItem('optionsOdoYear', JSON.stringify(optionsOdoYear));
        localStorage.setItem('odoOptionsNames', JSON.stringify(odoOptionsNames));

        this.setState({
            years: years,
            optionsOdoYear: optionsOdoYear,
        });

        this.setState({
            odoOptionsNames: odoOptionsNames,
        });

        // chart data
        let odoCatTmp = this.state.odoOptions;
        let odoSumTmp = this.state.odoCommonOptions;
        let odoYearTmp = this.state.odoYearOptions;
        let avgPlsTmp = this.state.avgPlsOptions;
        let avgSpdTmp = this.state.avgSpdOptions;
        odoCatTmp.xAxis.categories = years;
        odoCatTmp.series = odoOptionsNames;
        odoSumTmp.series[0].data = statFuncs.convertToSumChart(odoOptionsNames);
        odoYearTmp.series[0].data = statFuncs.makeOdoYearOptionsData(data, this.state.curYear);
        avgPlsTmp.series = statFuncs.makeAvgPulseData(data, this.state.curYear);
        avgSpdTmp.series = statFuncs.makeAvgSpeedData(data, this.state.curYear);

        localStorage.setItem('odoOptions', JSON.stringify(odoCatTmp));
        localStorage.setItem('odoCommonOptions', JSON.stringify(odoSumTmp));
        localStorage.setItem('odoYearOptions', JSON.stringify(odoYearTmp));
        localStorage.setItem('avgPlsOptions', JSON.stringify(avgPlsTmp));
        localStorage.setItem('avgSpdOptions', JSON.stringify(avgSpdTmp));

        this.setState({
            odoOptions: odoCatTmp,
            odoCommonOptions: odoSumTmp,
            odoYearOptions: odoYearTmp,
            avgPlsOptions: avgPlsTmp,
            avgSpdOptions: avgSpdTmp,
        });

        let curYearStat = this.filterStatDataByYear(this.state.curYear, data);
        let rideDaysArr = this.buildRideDays(data, this.state.curYear);
        let tiresOdo = this.countTiresOdo(data);

        localStorage.setItem('curYearStat', JSON.stringify(curYearStat));
        localStorage.setItem('rideDaysArr', JSON.stringify(rideDaysArr));
        localStorage.setItem('tiresOdo', JSON.stringify(tiresOdo));

        this.setState({
            curYearStat: curYearStat,
            rideDaysArr: rideDaysArr,
            tiresOdo: tiresOdo,
        });

        console.log(this.state);
    }

    /**
     * get data from DB
     */
    getData(login = "") {
        localStorage.clear();
        let formData = new FormData();
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);
        if (login !== "") {
            formData.append('foreign', login);
        }

        let that = this;

        axios({
            method: 'post',
            url: SETUP.goHost + '/get_year_data',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.setState({yearData: response.data});
            localStorage.setItem('yearData', JSON.stringify(response.data));
            
                    axios({
                        method: 'post',
                        url: SETUP.goHost + '/get_stat_data',
                        data: formData,
                        config: {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Origin': SETUP.reactHost,
                            }
                        },

                    }).then(function (response) {
                        that.setState({statData: response.data});
                        localStorage.setItem('statData', JSON.stringify(response.data));

                        that.buildCharts(response.data);
                    }).catch((error) => {
                        if (error.response) {
                            that.props.done("Stat data not found!", "uk-alert-warning");
                        }
                    });
        }).catch((error) => {
            that.setState({
                statData: [],
                tires: [],
                yearData: [],
            });

            if (error.response) {
                that.props.done("Years data not found!", "uk-alert-warning");
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
            let res = [];
            for (let i = 0 ; i < response.data.length ; i++ ) {
                res.push(response.data[i].Name);
            }
            that.setState({tires: res});
            localStorage.setItem('tires', JSON.stringify(res));

        }).catch((error) => {
            if (error.response) {
                that.props.done("Tire list not found!", "uk-alert-warning");
            }
        });
    }

    /**
     * click - year
     */
    preYear() {

        let tmpYearStat = this.filterStatDataByYear(this.state.curYear - 1);
        let count = 1;

        if (Object.keys(tmpYearStat).length === 0) {
            for (let i = 1 ; i < 10; i++) {
                tmpYearStat = this.filterStatDataByYear(this.state.curYear - i);
                if (Object.keys(tmpYearStat).length !== 0) {
                    count = i;
                    break;
                }
            }
            return;
        }

        let avgPlsTmp = this.state.avgPlsOptions;

        avgPlsTmp.series = statFuncs.makeAvgPulseData(this.state.statData, this.state.curYear - count);
        let avgSpdTmp = this.state.avgSpdOptions;
        avgSpdTmp.series = statFuncs.makeAvgSpeedData(this.state.statData, this.state.curYear - count);

        let odoYearTmp = this.state.odoYearOptions;
        odoYearTmp.series[0].data = statFuncs.makeOdoYearOptionsData(this.state.statData, this.state.curYear - count);

        this.setState({
            curYear: this.state.curYear - 1,
            curYearStat: tmpYearStat,
            rideDaysArr: this.buildRideDays(this.state.statData, this.state.curYear - count),
            avgPlsOptions: avgPlsTmp,
            avgSpdOptions: avgSpdTmp,
            odoYearOptions: odoYearTmp,
        });
    }

    /**
     * click + year
     */
    nextYear() {

        let tmpYearStat = this.filterStatDataByYear(this.state.curYear + 1);
        let count = 1;

        if (Object.keys(tmpYearStat).length === 0) {
            for (let i = 1 ; i < 10; i++) {
               tmpYearStat = this.filterStatDataByYear(this.state.curYear + i);
               if (Object.keys(tmpYearStat).length !== 0) {
                   count = i;
                   break;
               }
            }
            return;
        }

        let avgPlsTmp = this.state.avgPlsOptions;
        avgPlsTmp.series = statFuncs.makeAvgPulseData(this.state.statData, this.state.curYear + count);
        let avgSpdTmp = this.state.avgSpdOptions;
        avgSpdTmp.series = statFuncs.makeAvgSpeedData(this.state.statData, this.state.curYear + count);

        let odoYearTmp = this.state.odoYearOptions;
        odoYearTmp.series[0].data = statFuncs.makeOdoYearOptionsData(this.state.statData, this.state.curYear + count);




        this.setState({
            curYear: this.state.curYear + count,
            curYearStat: tmpYearStat,
            rideDaysArr: this.buildRideDays(this.state.statData, this.state.curYear + count),
            avgPlsOptions: avgPlsTmp,
            avgSpdOptions: avgSpdTmp,
        });
    }

    /**
     * filter data for one year
     *
     * @param year
     * @returns {Array}
     */
    filterStatDataByYear(year, data = this.state.statData) {
       var result = [];
       for (var i = 0 ; i < data.length ; i++) {
           if ((new Date(data[i].Date*1000)).getFullYear() === year) {
               result.push(data[i])
           };
       }

       return this.buildStatOneYear(result);
    }

    /**
     * build object for year-statistic
     *
     * @param data
     */
    buildStatOneYear(data) {

        // add total stat
        let dataCommon = [];
        for (var  i = 0 ; i < data.length; i++) {
            let tmp = JSON.parse(JSON.stringify(data[i]));
            tmp.Bike = "TOTAL";
            dataCommon.push(tmp);
        }
        data = data.concat(dataCommon);

        let result = {};

        for (var  i = 0 ; i < data.length; i++) {

            let d = data[i];
            if (result[d.Bike] === undefined ) {
                result[d.Bike] = {};
                result[d.Bike]['Bike'] = d.Bike;
                result[d.Bike]['Count'] = 0;
                result[d.Bike]['Dist'] = 0;
                result[d.Bike]['Maxpls'] = [0, 0];
                result[d.Bike]['Maxspd'] = [0, 0];
                result[d.Bike]['Maxdst'] = [0, 0];
                result[d.Bike]['Maxavgspd'] = [0, 0];
                result[d.Bike]['Time'] = 0;
                result[d.Bike]['Asf'] = 0;
                result[d.Bike]['Tvp'] = 0;
                result[d.Bike]['Grn'] = 0;
                result[d.Bike]['Bzd'] = 0;
                result[d.Bike]['Months'] = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
                result[d.Bike]['Avgspd'] = 0;
                result[d.Bike]['Avgpls'] = [0, 0];
                result[d.Bike]['LastDate'] = 0;
                result[d.Bike]['LastDist'] = 0;
                result[d.Bike]['LastAvgspd'] = 0;
                result[d.Bike]['LastAvgpls'] = 0;
                result[d.Bike]['LastBike'] = "";

            }

            result[d.Bike]['Count']++;
            result[d.Bike]['Dist'] += d.Dist ;
            result[d.Bike]['Maxpls'] = (d.Maxpls > result[d.Bike]['Maxpls'][0]) ? [d.Maxpls, d.Date] : result[d.Bike]['Maxpls'];
            result[d.Bike]['Maxspd'] = (d.Maxspd > result[d.Bike]['Maxspd'][0]) ? [d.Maxspd, d.Date] : result[d.Bike]['Maxspd'];
            result[d.Bike]['Maxdst'] = (d.Dist > result[d.Bike]['Maxdst'][0]) ? [d.Dist, d.Date] : result[d.Bike]['Maxdst'];
            result[d.Bike]['Maxavgspd'] = ((d.Dist / d.Time * 60 * 60) > result[d.Bike]['Maxavgspd'][0]) ? [(d.Dist / d.Time * 60 * 60).toFixed(2), d.Date] : result[d.Bike]['Maxavgspd'];
            result[d.Bike]['Time'] += d.Time;
            result[d.Bike]['Asf'] += (d.Dist / 100 * d.Surfasf);
            result[d.Bike]['Tvp'] += (d.Dist / 100 * d.Surftvp);
            result[d.Bike]['Grn'] += (d.Dist / 100 * d.Surfgrn);
            result[d.Bike]['Bzd'] += (d.Dist / 100 * d.Srfbzd);

            let month = (new Date(d.Date*1000)).getMonth();
            result[d.Bike]['Months'][month] = [result[d.Bike]['Months'][month][0] += d.Dist, result[d.Bike]['Months'][month][1] + 1, 0 ];

            if (d.Avgpls > 0) {
                result[d.Bike]['Avgpls'] = [result[d.Bike]['Avgpls'][0] + d.Avgpls, result[d.Bike]['Avgpls'][1]+1];
            }

            if (d.Date > result[d.Bike]['LastDate']) {
                result[d.Bike]['LastDate'] = d.Date;
                result[d.Bike]['LastDist'] = d.Dist;
                result[d.Bike]['LastAvgpls'] = d.Avgpls;
                result[d.Bike]['LastAvgspd'] = (d.Dist / d.Time * 60 * 60).toFixed(2);
                if (d.Bike === "TOTAL" ) result[d.Bike]['LastBike'] = d.Id;
            }
        }

        for (var bike in result) {
            let r = result[bike];

            result[bike].Dist = r.Dist.toFixed(2);
            result[bike].AvgDist = (r.Dist / r.Count).toFixed(2);
            result[bike].AvgTime = (r.Time / r.Count).toFixed();
            result[bike].Asf = [r.Asf.toFixed(2), (r.Asf*100/r.Dist).toFixed()];
            result[bike].Tvp = [r.Tvp.toFixed(2), (r.Tvp*100/r.Dist).toFixed()];
            result[bike].Grn = [r.Grn.toFixed(2), (r.Grn*100/r.Dist).toFixed()];
            result[bike].Bzd = [r.Bzd.toFixed(2), (r.Bzd*100/r.Dist).toFixed()];

            // build month dist percents
            let maxMonthDist = 0;
            for (var z = 0 ; z < result[bike].Months.length ; z++) {
                if (result[bike].Months[z][0] > maxMonthDist) maxMonthDist = result[bike].Months[z][0];
            }

            for (var z = 0 ; z < result[bike].Months.length ; z++) {
                result[bike].Months[z][2] = r.Months[z][0] / maxMonthDist * 100;
            }

            result[bike].Avgpls = (r.Avgpls[0] / r.Avgpls[1]).toFixed();
            result[bike].Avgspd = (r.Dist / r.Time * 60 * 60).toFixed(2);
        }

        // last bike for common
        for (let z = 0 ; z < data.length; z++) {
            if (data[z].Id === result['TOTAL']['LastBike']) {
                result['TOTAL']['LastBike'] = data[z].Bike;
                break;
            }
        }

        return result;
    }


    getForeignStat() {
        //this.props.route('/' + document.getElementById("foreign").value);
        this.getData(document.getElementById("foreign").value);
    }

    getMyStat() {
        document.getElementById("foreign").value = "";
        this.getData();
    }

    reload(data) {
        localStorage.setItem('statData', JSON.stringify(data));

        this.setState({
            statData: data,
        });

        this.buildCharts(data);
    }


    /**
     * render
     * @returns {*}
     */
    render() {

        let tiresOdo = (odo) => {

            let maxDist = 0;
            Object.keys(odo).forEach(function (key) {
                if (maxDist < odo[key]) maxDist = odo[key];
            });

            let res = '';
            Object.keys(odo).forEach(function(key) {

                if (key.includes("(asphalt)") || key.includes("(bad asphalt)") || key.includes("(country)") || key.includes("(offroad)")) {
                    res += '<tr key="' + key + '" style="font-size: 12px;">' +
                        '<td width="40%">' + key + '</td>' +
                        '<td width="20%" align="right">' + odo[key].toFixed(2) + ' km</td>' +
                        '<td width="40%"><div style="width: ' + odo[key]*100/maxDist + '%;" class="surfacePerc"></div></td>' +
                        '</tr>';
                } else {
                    res += '<tr key="' + key + '" style="font-size: 16px;">' +
                        '<td width="40%"><b>' + key + '</b></td>' +
                        '<td width="20%" class="colorred textBold" align="right">' + odo[key].toFixed(2) + ' km</td>' +
                        '<td width="40%"><div style="width: ' + odo[key]*100/maxDist + '%;" class="surfacePerc"></div></td>' +
                        '</tr>';
                }
            });
            return res;
        };

        let pulseZones = [220 - (+(new Date()).getFullYear() - +this.props.state.year), ((220 - (+(new Date()).getFullYear() - +this.props.state.year)) / 10).toFixed()];

        let pulseZonesView = (!this.props.state.year > 0) ? "" : <div className="uk-width-1-3@l uk-width-1-1@m">
                <h4>Pulse zones</h4>
                <table width="100%">
                    <tbody>
                    <tr style={{color: "#B900FF"}}><td>VO2 Max</td><td>(88-100%)</td><td><b>{pulseZones[0] - pulseZones[1] + '-'}<span style={{color: "red"}}>{pulseZones[0]}</span></b></td><td>per/min</td></tr>
                    <tr style={{color: "#8E00C4"}}><td>Anaerobic Threshold</td><td>(76-88%)</td><td><b>{(+pulseZones[0] - +pulseZones[1]*2) + '-' + (+pulseZones[0] - +pulseZones[1])}</b></td><td>per/min</td></tr>
                    <tr style={{color: "#6B0094"}}><td>Aerobic</td><td>(64-76%)</td><td><b>{(+pulseZones[0] - +pulseZones[1]*3) + '-' + (+pulseZones[0] - +pulseZones[1]*2)}</b></td><td>per/min</td></tr>
                    <tr style={{color: "#55006A"}}><td>Easy</td><td>(52-64%)</td><td><b>{(+pulseZones[0] - +pulseZones[1]*4) + '-' + (+pulseZones[0] - +pulseZones[1]*3)}</b></td><td>per/min</td></tr>
                    <tr style={{color: "#350042"}}><td>Healthy Heart</td><td>(40-52%)</td><td><b>{(+pulseZones[0] - +pulseZones[1]*5) + '-' + (+pulseZones[0] - +pulseZones[1]*4)}</b></td><td>per/min</td></tr>
                    </tbody>
                </table>
            </div>

        return (
            <div className="uk-container">
                <h2>Statistic</h2>
                <div style={{color: "grey", fontSize: "0.8em"}} align="right">Watch another Stat by login: <input id="foreign" type={'text'} name={'foreignLogin'} placeholder={'Login'} /><button onClick={this.getForeignStat}>Watch</button> <button onClick={this.getData}>My stat</button></div>
                <br />
                <div className="uk-grid">
                    <div className="uk-width-1-2@m uk-width-1-1@s">
                        <div className="uk-grid">
                            <div className="uk-width-1-2@m uk-width-1-1@s">
                                <YearList data={this.state.optionsOdoYear} years={JSON.parse(JSON.stringify( this.state.years )).reverse()}/>
                            </div>
                            <div className="uk-width-1-2@m uk-width-1-1@s">
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={this.state.odoCommonOptions}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="uk-width-1-2@m uk-width-1-1@s">
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={this.state.odoOptions}
                        />
                    </div>
                </div>
                <br />
                <div className="uk-row" align="center">
                    <h2><span className="yearArrows" onClick={this.preYear}>- </span><b className="colorblue">{this.state.curYear}</b><span className="yearArrows" onClick={this.nextYear}> +</span></h2>
                    <DistStat data={this.state.curYearStat} />
                </div>
                <hr />
                <div className="uk-grid pulseTires">
                    {pulseZonesView}

                    <div className="uk-width-2-3@l uk-width-1-1@m">
                        <h4>Tires odo</h4>
                        <table width = "100%">
                            <tbody style={{width: '100%'}} dangerouslySetInnerHTML={{__html: tiresOdo(this.state.tiresOdo)}}/>
                        </table>
                    </div>
                </div>
                <h2>Activity</h2>
                <div className="uk-flex-center" uk-grid="true">
                    <div className="uk-flex-first">January<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={0} /></div>
                    <div>Febrary<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={1} /></div>
                    <div>Marth<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={2} /></div>
                    <div>April<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={3} /></div>
                    <div>May<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={4} /></div>
                    <div>June<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={5} /></div>
                    <div>Jule<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={6} /></div>
                    <div>August<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={7} /></div>
                    <div>September<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={8} /></div>
                    <div>October<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={9} /></div>
                    <div>November<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={10} /></div>
                    <div className="uk-flex-last">December<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={11} /></div>
                </div>
                <br />
                <HighchartsReact
                    highcharts={Highcharts}
                    options={this.state.odoYearOptions}
                />
                <br />
                <div className="uk-grid">
                    <div className="uk-width-1-2@m uk-width-1-1@s">
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={this.state.avgPlsOptions}
                        />
                    </div>
                    <div className="uk-width-1-2@m uk-width-1-1@s">
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={this.state.avgSpdOptions}
                        />
                    </div>
                </div>
                <h2>Data</h2>
                    <StatDataTable reload={this.reload} data={this.state.statData} odoYear={this.state.optionsOdoYear} tires={this.state.tires} userId={this.props.state.userId} token={this.props.state.token} done={this.props.done}/>
                <br />
                <h2>Technical data</h2>
                    <TechDataTable data={this.state.statData}/>
                <br />
            </div>

        );
    }

}

export default Statistic