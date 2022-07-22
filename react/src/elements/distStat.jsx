import React from 'react';
import * as statFuncs from '../elements/statFuncs';

class DistStat extends React.Component {

    convertTimeStampToDate(t) {
        var h = Math.floor((t / 3600));
        var s = t % 60;
        var m = (t - s - h*3600) / 60;

        if (m < 10) m = "0" + m;
        if (s < 10) s = "0" + s;

        return h + ":" + m + ":" + s;
    }

    render() {

        let lastAverageMark = (avg, last, unit = "kmh") => {

            let markUp = <span title={"Last ride is " + (+last - +avg).toFixed(2) + " " + unit + " bigger than average"} style={{color: (unit === "per/min") ? "red" : "green"}}><b>▴</b></span>;
            let markDown = <span title={"Last ride is " + (+avg - +last).toFixed(2) + " " + unit + " less than average"} style={{color: (unit === "per/min") ? "green" : "red"}}><b>▾</b></span>;
            let markMiddle = <span style={{color: "orange"}}><b>♦</b></span>;

            if (last === 0 || avg === 0 || last === avg) {
                return markMiddle;
            } else if (last > avg) {
                return markUp;
            } else if (last < avg){
                return markDown;
            } else {
                return markMiddle;
            }
        };

        let bikeList = Object.keys(this.props.data).map((item, i) => (
            <div key={i} className='statDist'>
                <h4 style={{"lineHeight": "0px"}} align="left">{this.props.data[item]["Bike"]}</h4>
                <div className="customhr"></div>
                <div className="uk-grid">
                    <div className="uk-width-1-3@l uk-width-1-1@m">
                        <table width="100%">
                            <tbody>
                                <tr><td>Total dist:</td><td className='colorred textBold' align="right">{this.props.data[item]['Dist']} km</td></tr>
                                <tr><td>Total time:</td><td className='colorblue textBold' align="right">{this.convertTimeStampToDate(this.props.data[item]['Time'])}</td></tr>
                                <tr><td> </td></tr>
                                <tr><td>Average dist:</td><td className='colorred textBold' align="right">{this.props.data[item]['AvgDist']} km</td></tr>
                                <tr><td>Average time:</td><td className='colorblue textBold' align="right">{this.convertTimeStampToDate(this.props.data[item]['AvgTime'])}</td></tr>
                                <tr><td>Count:</td><td className='colorblack textBold' align="right">{this.props.data[item]['Count']}</td></tr>
                            </tbody>
                        </table>  
                        <br />  
                        <table width="100%">
                            <tbody>
                            <tr><td width="25%">Asphalt:</td><td width="50%"><div style={{width: this.props.data[item]['Asf'][1] + "%"}} className="surfacePerc"></div></td><td className="colorred textBold" width="25%" align="right">{this.props.data[item]['Asf'][0]} km</td></tr>
                            <tr><td width="25%">Bad asphalt:</td><td width="50%"><div style={{width: this.props.data[item]['Tvp'][1] + "%"}} className="surfacePerc"></div></td><td className="colorred textBold" width="25%" align="right">{this.props.data[item]['Tvp'][0]} km</td></tr>
                            <tr><td width="25%">Country:</td><td width="50%"><div style={{width: this.props.data[item]['Grn'][1] + "%"}} className="surfacePerc"></div></td><td className="colorred textBold" width="25%" align="right">{this.props.data[item]['Grn'][0]} km</td></tr>
                            <tr><td width="25%">Offroad:</td><td width="50%"><div style={{width: this.props.data[item]['Bzd'][1] + "%"}} className="surfacePerc"></div></td><td className="colorred textBold" width="25%" align="right">{this.props.data[item]['Bzd'][0]} km</td></tr>
                            </tbody>
                        </table>
                        <br />
                    </div>
                    <div className="uk-width-1-3@l uk-width-1-1@m">
                        <table width="100%">
                            <tbody>
                            <tr><td width="50%">Total average speed: </td><td className='colorred textBold' width="45%" align="right">{this.props.data[item]['Avgspd']}</td><td className='colorred textBold' width="5%">km/h</td></tr>
                            <tr><td width="50%">Maximum average speed: </td><td className='colorred textBold' width="45%" align="right" title={statFuncs.humanDate(this.props.data[item]['Maxavgspd'][1])}>{this.props.data[item]['Maxavgspd'][0]}</td><td className='colorred textBold' width="5%">km/h</td></tr>
                            <tr className='colorpurple'><td width="50%">Total average pulse: </td><td className='textBold' width="45%" align="right">{(this.props.data[item]['Avgpls'] !== "NaN" && this.props.data[item]['Avgpls'] !== 0) ? this.props.data[item]['Avgpls'] : "-" }</td><td className='textBold' width="5%">{(this.props.data[item]['Avgpls'] !== "NaN" && this.props.data[item]['Avgpls'] !== 0) ? "per/min" : "" }</td></tr>
                            <tr className='colorpurple'><td width="50%">Maximum pulse: </td><td className='textBold' width="45%" align="right" title={(this.props.data[item]['Maxspd'][0] > 0) ? statFuncs.humanDate(this.props.data[item]['Maxpls'][1]) : "-"}>{(this.props.data[item]['Maxpls'][0] !== "NaN" && this.props.data[item]['Maxpls'][0] !== 0) ? this.props.data[item]['Maxpls'][0] : "-"}</td><td className='textBold' width="5%">{(this.props.data[item]['Maxpls'][0] !== "NaN" && this.props.data[item]['Maxpls'][0] !== 0) ? "per/min" : ""}</td></tr>
                            <tr><td width="50%">Maximum speed: </td><td className='colorred textBold' width="45%" align="right" title={(this.props.data[item]['Maxspd'][0] > 0) ? statFuncs.humanDate(this.props.data[item]['Maxspd'][1]) : "-"}>{(this.props.data[item]['Maxspd'][0] > 0) ? (this.props.data[item]['Maxspd'][0]).toFixed(2) : "-"}</td><td className='colorred textBold' width="5%">{(this.props.data[item]['Maxspd'][0] > 0) ? "km/h" : ""}</td></tr>
                            <tr><td width="50%">Maximum dist: </td><td className='colorred textBold' width="45%" align="right" title={statFuncs.humanDate(this.props.data[item]['Maxdst'][1])}>{(this.props.data[item]['Maxdst'][0]).toFixed(2)}</td><td className='colorred textBold' width="5%">km</td></tr>
                            </tbody>
                        </table>
                        <br />
                        <div className="uk-float-left textBold">{(this.props.data[item]['LastBike'] !== undefined) ? this.props.data[item]['LastBike'] : ""}</div>

                        <table width="100%">
                            <tbody>
                            <tr><td width="60%">Last ride date <span className="colorblue textBold">{statFuncs.humanDate(this.props.data[item]['LastDate'])}</span></td><td width="5%"></td><td width="25%"></td><td className="colorred textBold" width="10%"></td></tr>
                            <tr><td width="60%">Last ride average speed</td><td align="right" width="5%">{lastAverageMark(this.props.data[item]['Avgspd'], this.props.data[item]['LastAvgspd'])}</td><td className="textBold colorred" align="right" width="25%">{this.props.data[item]['LastAvgspd']}</td><td className="colorred textBold" width="10%">km/h</td></tr>
                            <tr><td width="60%">Last ride average pulse</td><td align="right" width="5%">{lastAverageMark(this.props.data[item]['Avgpls'], this.props.data[item]['LastAvgpls'], "per/min")}</td><td className="textBold colorpurple" align="right" width="25%">{(this.props.data[item]['LastAvgpls'] > 0) ? this.props.data[item]['LastAvgpls'] : "-"}</td><td className="textBold colorpurple" width="10%">{(this.props.data[item]['LastAvgpls'] > 0) ? "per/min" : ""}</td></tr>
                            <tr><td width="60%">Last ride distance</td><td align="right" width="5%">{lastAverageMark(this.props.data[item]['AvgDist'], this.props.data[item]['LastDist'])}</td><td className='textBold colorred' align="right" width="25%">{this.props.data[item]['LastDist']}</td><td className='textBold colorred' width="10%">km</td></tr>
                            </tbody>
                        </table>
                        <br />
                    </div>
                    <div className="uk-width-1-3@l uk-width-1-1@m">
                        <table width="100%">
                            <tbody>
                            <tr className={(this.props.data[item]['Months'][0][1] > 0) ? "colorblack textBold" : ""}><td className={(this.props.data[item]['Months'][0][1] > 0) ? "colorblue" : ""} width="10%">Jan</td><td width="5%" align="right">{this.props.data[item]['Months'][0][1]}</td><td className={(this.props.data[item]['Months'][0][1] > 0) ? "colorred" : ""} width="25%" align="right">{this.props.data[item]['Months'][0][0].toFixed(2)} km</td><td width="60%"><div style={{width: this.props.data[item]['Months'][0][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr className={(this.props.data[item]['Months'][1][1] > 0) ? "colorblack textBold" : ""}><td className={(this.props.data[item]['Months'][1][1] > 0) ? "colorblue" : ""} width="10%">Feb</td><td width="5%" align="right">{this.props.data[item]['Months'][1][1]}</td><td className={(this.props.data[item]['Months'][1][1] > 0) ? "colorred" : ""} width="25%" align="right">{this.props.data[item]['Months'][1][0].toFixed(2)} km</td><td width="60%"><div style={{width: this.props.data[item]['Months'][1][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr className={(this.props.data[item]['Months'][2][1] > 0) ? "colorblack textBold" : ""}><td className={(this.props.data[item]['Months'][2][1] > 0) ? "colorblue" : ""} width="10%">Mar</td><td width="5%" align="right">{this.props.data[item]['Months'][2][1]}</td><td className={(this.props.data[item]['Months'][2][1] > 0) ? "colorred" : ""} width="25%" align="right">{this.props.data[item]['Months'][2][0].toFixed(2)} km</td><td width="60%"><div style={{width: this.props.data[item]['Months'][2][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr className={(this.props.data[item]['Months'][3][1] > 0) ? "colorblack textBold" : ""}><td className={(this.props.data[item]['Months'][3][1] > 0) ? "colorblue" : ""} width="10%">Apr</td><td width="5%" align="right">{this.props.data[item]['Months'][3][1]}</td><td className={(this.props.data[item]['Months'][3][1] > 0) ? "colorred" : ""} width="25%" align="right">{this.props.data[item]['Months'][3][0].toFixed(2)} km</td><td width="60%"><div style={{width: this.props.data[item]['Months'][3][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr className={(this.props.data[item]['Months'][4][1] > 0) ? "colorblack textBold" : ""}><td className={(this.props.data[item]['Months'][4][1] > 0) ? "colorblue" : ""} width="10%">May</td><td width="5%" align="right">{this.props.data[item]['Months'][4][1]}</td><td className={(this.props.data[item]['Months'][4][1] > 0) ? "colorred" : ""} width="25%" align="right">{this.props.data[item]['Months'][4][0].toFixed(2)} km</td><td width="60%"><div style={{width: this.props.data[item]['Months'][4][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr className={(this.props.data[item]['Months'][5][1] > 0) ? "colorblack textBold" : ""}><td className={(this.props.data[item]['Months'][5][1] > 0) ? "colorblue" : ""} width="10%">Jun</td><td width="5%" align="right">{this.props.data[item]['Months'][5][1]}</td><td className={(this.props.data[item]['Months'][5][1] > 0) ? "colorred" : ""} width="25%" align="right">{this.props.data[item]['Months'][5][0].toFixed(2)} km</td><td width="60%"><div style={{width: this.props.data[item]['Months'][5][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr className={(this.props.data[item]['Months'][6][1] > 0) ? "colorblack textBold" : ""}><td className={(this.props.data[item]['Months'][6][1] > 0) ? "colorblue" : ""} width="10%">Jul</td><td width="5%" align="right">{this.props.data[item]['Months'][6][1]}</td><td className={(this.props.data[item]['Months'][6][1] > 0) ? "colorred" : ""} width="25%" align="right">{this.props.data[item]['Months'][6][0].toFixed(2)} km</td><td width="60%"><div style={{width: this.props.data[item]['Months'][6][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr className={(this.props.data[item]['Months'][7][1] > 0) ? "colorblack textBold" : ""}><td className={(this.props.data[item]['Months'][7][1] > 0) ? "colorblue" : ""} width="10%">Aug</td><td width="5%" align="right">{this.props.data[item]['Months'][7][1]}</td><td className={(this.props.data[item]['Months'][7][1] > 0) ? "colorred" : ""} width="25%" align="right">{this.props.data[item]['Months'][7][0].toFixed(2)} km</td><td width="60%"><div style={{width: this.props.data[item]['Months'][7][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr className={(this.props.data[item]['Months'][8][1] > 0) ? "colorblack textBold" : ""}><td className={(this.props.data[item]['Months'][8][1] > 0) ? "colorblue" : ""} width="10%">Sep</td><td width="5%" align="right">{this.props.data[item]['Months'][8][1]}</td><td className={(this.props.data[item]['Months'][8][1] > 0) ? "colorred" : ""} width="25%" align="right">{this.props.data[item]['Months'][8][0].toFixed(2)} km</td><td width="60%"><div style={{width: this.props.data[item]['Months'][8][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr className={(this.props.data[item]['Months'][9][1] > 0) ? "colorblack textBold" : ""}><td className={(this.props.data[item]['Months'][9][1] > 0) ? "colorblue" : ""} width="10%">Oct</td><td width="5%" align="right">{this.props.data[item]['Months'][9][1]}</td><td className={(this.props.data[item]['Months'][9][1] > 0) ? "colorred" : ""} width="25%" align="right">{this.props.data[item]['Months'][9][0].toFixed(2)} km</td><td width="60%"><div style={{width: this.props.data[item]['Months'][9][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr className={(this.props.data[item]['Months'][10][1] > 0) ? "colorblack textBold" : ""}><td className={(this.props.data[item]['Months'][10][1] > 0) ? "colorblue" : ""} width="10%">Nov</td><td width="5%" align="right">{this.props.data[item]['Months'][10][1]}</td><td className={(this.props.data[item]['Months'][10][1] > 0) ? "colorred" : ""} width="25%" align="right">{this.props.data[item]['Months'][10][0].toFixed(2)} km</td><td width="60%"><div style={{width: this.props.data[item]['Months'][10][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr className={(this.props.data[item]['Months'][11][1] > 0) ? "colorblack textBold" : ""}><td className={(this.props.data[item]['Months'][11][1] > 0) ? "colorblue" : ""} width="10%">Dec</td><td width="5%" align="right">{this.props.data[item]['Months'][11][1]}</td><td className={(this.props.data[item]['Months'][11][1] > 0) ? "colorred" : ""} width="25%" align="right">{this.props.data[item]['Months'][11][0].toFixed(2)} km</td><td width="60%"><div style={{width: this.props.data[item]['Months'][11][2] + "%"}} className="monthPerc"></div></td></tr>
                            </tbody>
                        </table>
                        <br />
                    </div>
                </div>
            </div>
        ));

        return (
            <div className="uk-container">
                {bikeList}
            </div>
        )
    }
}

export default DistStat