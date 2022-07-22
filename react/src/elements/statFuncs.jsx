/**
 * Init odoOptions
 * @returns {{colors: string[], chart: {type: string}, title: {text: string, x: number}, subtitle: {text: string, x: number}, xAxis: {categories: Array}, yAxis: {title: {text: boolean}, plotLines: *[]}, tooltip: {valueSuffix: string}, series: Array}}
 */
export function odoOptions() {
    return {
        colors: ['darkred', 'darkblue', 'darkgreen', 'BlueViolet ', 'Chocolate', 'DarkSlateGrey', 'Red ', 'DimGrey', 'Blue', 'Green'],
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Kilometers',
            x: -20 //center
        },
        subtitle: {
            text: 'Years',
            x: -20
        },
        xAxis: {
            categories: []
        },
        yAxis: {
            title: {
                text: false
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ' km'
        },
        series: []
    }
}

/**
 * Init odoCommonOptions
 * @returns {{colors: string[], chart: {type: string}, title: {text: string}, subtitle: {text: string}, xAxis: {type: string, labels: {rotation: number, style: {fontSize: string, fontFamily: string}}}, yAxis: {min: number, title: {text: boolean}}, legend: {enabled: boolean}, tooltip: {pointFormat: string}, series: *[]}}
 */
export function odoCommonOptions() {
    return {
        colors: ['darkred'],

        chart: {
            type: 'column'
        },
        title: {
            text: 'Total distance'
        },
        subtitle: {
            text: 'for each bike'
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -90,
                style: {
                    fontSize: '8px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: false
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Total distance is: <b>{point.y:.1f} km</b>'
        },
        series: [{
            name: 'ТС',
            data: [],
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.1f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '12px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    }
}


/**
 * get array of years
 *
 * @param arr
 * @param statArr
 * @returns {*[]}
 */
export function getYearsList(arr, statArr) {
    let result = [];
    for (var i = 0; i < arr.length; i++) {
        result.push(arr[i].Year);
    }

    for (var i = 0; i < statArr.length; i++) {
        result.push((new Date(statArr[i].Date * 1000)).getFullYear());
    }

    return result.sort().filter(onlyUnique);
}

/**
 * get object bike: {year: distant}
 *
 * @param arr
 * @param statArr
 * @returns {{}}
 */
export function getOdoBikeList(arr, statArr) {

    let result = {};
    let common = {};

    for (var i = 0; i < arr.length; i++) {
        if (result[arr[i].Bike] === undefined) result[arr[i].Bike] = {};
        result[arr[i].Bike][arr[i].Year] = arr[i].Dist;

        if (common[arr[i].Year] === undefined) {
            common[arr[i].Year] = arr[i].Dist;
        } else {
            common[arr[i].Year] += arr[i].Dist;
            common[arr[i].Year] = +common[arr[i].Year].toFixed(2);
        }
    }

    for (var i = 0; i < statArr.length; i++) {
        var bike = statArr[i].Bike;
        var year = (new Date(statArr[i].Date * 1000)).getFullYear();
        var dist = statArr[i].Dist;

        if (result[bike] === undefined) result[bike] = {};
        if (result[bike][year] === undefined) {
            result[bike][year] = dist;
        } else {
            result[bike][year] += dist;
            result[bike][year] = +result[bike][year].toFixed();
        }

        if (common[year] === undefined) {
            common[year] = dist;
        } else {
            common[year] += dist;
            common[year] = +common[year].toFixed(2);
        }
    }

    result.TOTAL = common;
    return result;
}

/**
 * average pulse chart options
 *
 * @returns {{colors: string[], chart: {type: string}, title: {text: string}, subtitle: {text: string}, xAxis: {type: string, dateTimeLabelFormats: {month: string, year: string}, title: {text: string}}, yAxis: {title: {text: string}, min: number}, tooltip: {headerFormat: string, pointFormat: string}, plotOptions: {spline: {marker: {enabled: boolean}}}, series: Array}}
 */
export function avgPlsOptions() {
    return {
        colors: ['darkred', 'darkblue', 'darkgreen', '#4C0B5F', '#2E2E2E', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
        chart: {
            type: 'spline'
        },
        title: {
            text: 'AVERAGE PULSE'
        },
        subtitle: {
            text: 'Average year pulse (Pulse / Date)'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: 'Beats per minute'
            },
            min: 100
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b}: {point.y:.0f} beat / min'
        },

        plotOptions: {
            spline: {
                marker: {
                    enabled: true
                }
            }
        },

        series: []
    }
}

/**
 * average speed chart options
 *
 * @returns {{colors: string[], chart: {type: string}, title: {text: string}, subtitle: {text: string}, xAxis: {type: string, dateTimeLabelFormats: {month: string, year: string}, title: {text: string}}, yAxis: {title: {text: string}, min: number}, tooltip: {headerFormat: string, pointFormat: string}, plotOptions: {spline: {marker: {enabled: boolean}}}, series: Array}}
 */
export function avgSpdOptions() {

    return {
        colors: ['darkred', 'darkblue', 'darkgreen', 'BlueViolet ', 'Chocolate', 'DarkSlateGrey', 'Red ', 'DimGrey', 'Blue', 'Green'],
        chart: {
            type: 'spline'
        },
        title: {
            text: 'AVERAGE SPEED'
        },
        subtitle: {
            text: 'Year chart (Average speed / Date)'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: 'Speed (km/h)'
            },
            min: 0
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b}: {point.y:.2f} km/h'
        },

        plotOptions: {
            spline: {
                marker: {
                    enabled: true
                }
            }
        },

        series: []
    }
}

/**
 * make options data for average speed chart
 *
 * @param statData
 * @param year
 * @returns {Array}
 */
export function makeAvgSpeedData(statData, year) {

    let result = [];

    for (let i = 0; i< statData.length; i++) {

        let curDate = new Date(statData[i].Date * 1000);
        let date = Date.UTC(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());

        //filter
        if (curDate.getFullYear() !== year) continue;

        let pass = false;

        if (i === 0) result.push({"name": statData[i].Bike, "data": [[date, statData[i].Dist / statData[i].Time * 3600]]});

        for( let z = 0; z < result.length; z++) {
            if (result[z].name === statData[i].Bike) {
                result[z].data.push([date, statData[i].Dist / statData[i].Time * 3600]);
                pass = true;
                break;
            }
        }
        if (!pass) result.push({"name": statData[i].Bike, "data": [[date, statData[i].Dist / statData[i].Time * 3600]]});
    }

    return result;
}


/**
 * make options data for average pulse chart
 *
 * @param statData
 * @param year
 * @returns {Array}
 */
export function makeAvgPulseData(statData, year) {

    let result = [];

    for (let i = 0; i< statData.length; i++) {

        let curDate = new Date(statData[i].Date * 1000);
        let date = Date.UTC(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());

        //filter
        if (statData[i].Avgpls === 0 || statData[i].Avgpls === undefined) continue;
        if (curDate.getFullYear() !== year) continue;

        let pass = false;

        if (i === 0) result.push({"name": statData[0].Bike, "data": [[date, statData[0].Avgpls]]});

        for( let z = 0; z < result.length; z++) {
            if (result[z].name === statData[i].Bike) {
                result[z].data.push([date, statData[i].Avgpls]);
                pass = true;
                break;
            }
        }
        if (!pass) result.push({"name": statData[i].Bike, "data": [[date, statData[i].Avgpls]]});
    }

    return result;
}


/**
 * options for year odo chart
 *
 * @returns {{chart: {type: string}, title: {text: string}, subtitle: {text: string}, xAxis: {type: string, dateTimeLabelFormats: {month: string, year: string}, title: {text: string}}, yAxis: {title: {text: string}, min: number}, tooltip: {headerFormat: string, pointFormat: string}, plotOptions: {spline: {marker: {enabled: boolean}}}, series: *[]}}
 */
export function odoYearOptions() {
    return {
        chart: {
            type: 'spline'
        },
        colors: ['darkred'],
        title: {
            text: 'TOTAL DISTANCE'
        },
        subtitle: {
            text: 'Year chart (Distance / Date)'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: 'Kilometers'
            },
            min: 0
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b}: {point.y:.2f} km'
        },

        plotOptions: {
            spline: {
                marker: {
                    enabled: true
                }
            }
        },

        series: [{
            name: 'Distance',
            data: []
        }]
    }
}

/**
 * build data fo year odo chart
 *
 * @param statData
 * @param year
 * @returns {Array}
 */
export function makeOdoYearOptionsData(statData, year) {

    let res = [];

    let tmpDate;
    let tmpDay;
    let tmpDist = 0;

    statData = JSON.parse(JSON.stringify(statData));
    statData.sort((a,b) => {if (a.Date > b.Date) return 1; if (a.Date < b.Date) return -1; return 0;});

    for (let d = 0; d<statData.length; d++) {

        let curDate = new Date(statData[d].Date * 1000);

        if (curDate.getFullYear() !== year) continue;
        if (curDate.getDate() + "-" + curDate.getMonth() === tmpDay) {
            tmpDist += statData[d].Dist;
            res.splice(-1,1);
        }
        else {
            tmpDay = curDate.getDate() + "-" + curDate.getMonth();
            tmpDate = statData[d].Date;
            tmpDist = statData[d].Dist;
        }
        res.push([Date.UTC(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()), tmpDist]);
    }

    return res;
}

/**
 * make series object for highcharts
 *
 * @param optionsOdoYear
 * @param years
 * @returns {Array}
 */
export function makeOdoOptions(optionsOdoYear, years) {

    let result = [];

    for (var k in optionsOdoYear) {
        if (typeof optionsOdoYear[k] !== 'function') {
            //alert("Key is " + k + ", value is" + optionsOdoYear[k]);
            let nameData = k;
            let dataData = [];

            for (var z = 0; z < years.length; z++) {
                if (optionsOdoYear[k][years[z]] !== undefined) {
                    dataData.push(optionsOdoYear[k][years[z]]);
                } else {
                    dataData.push(null);
                }
            }
            result.push({name: nameData, data: dataData});
        }
    }

    return result;
}

/**
 * [convertToSumChart description]
 * @param  {[type]} odoOptionsNames [description]
 * @return {[type]}                 [description]
 */
export function convertToSumChart(odoOptionsNames) {
    var result = [];
    for (var k in odoOptionsNames) {
        if (typeof odoOptionsNames[k] !== 'function') {
            result.push([odoOptionsNames[k].name, (odoOptionsNames[k].data).reduce(function (a, b) {
                return (a + b)
            })]);
        }
    }
    return result;
}

/**
 * array unique filter
 *
 * @param value
 * @param index
 * @param self
 * @returns {boolean}
 */
export function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

/**
 * Convert to human-date
 * 
 * @param date
 * @returns {string}
 */
export function humanDate(date) {

        let mnth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let d = new Date(date * 1000);
        let day = (d.getDate() < 10) ? "0" + d.getDate() : d.getDate();
        return day + " " + mnth[d.getMonth()] + " " + d.getFullYear();
}

/**
 * convert time
 *
 * @param t
 * @returns {string}
 */
export function convertTimeStampToDate(t) {
        var h = Math.floor((t / 3600));
        var s = t % 60;
        var m = (t - s - h*3600) / 60;

        if (m < 10) m = "0" + m;
        if (s < 10) s = "0" + s;
        if (h < 10) h = "0" + h;

        return h + ":" + m + ":" + s;
}