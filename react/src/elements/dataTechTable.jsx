import React from 'react';
import * as statFuncs from './statFuncs';

/**
 * simuate mose click
 *
 * @param el
 * @param etype
 */
function eventFire(el, etype){
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

let techRowsCount = 0;

/**
 *
 */
class TechDataTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filter: "",
        }

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    /**
     * set state
     * @param event
     */
    handleInputChange(event) {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

        this.tdayInit = this.tdayInit.bind(this);
    }

    /**
     * build data
     *
     * @returns {string}
     */
    buildData() {

        techRowsCount = 0;

        // filter DESC
        function compare(a,b) {
            if (a.Date < b.Date)
                return 1;
            if (a.Date > b.Date)
                return -1;
            return 0;
        }

        let tmpData = JSON.parse(JSON.stringify(this.props.data));
        tmpData.sort(compare);

        let result = "<thead><tr><td width='10%'>Date</td><td width='20%'>Bike</td><td width='60%'>Describe</td><td width='10%'>Odo</td></tr></thead><tbody>";

        for (let d = 0; d < tmpData.length; d++) {

            let odoTehDist = 0;
            let date = statFuncs.humanDate(tmpData[d].Date);
            
            for (let z = 0; z < tmpData.length; z++) {
                if (tmpData[d].Date < tmpData[z].Date && tmpData[d].Bike === tmpData[z].Bike) odoTehDist += tmpData[z].Dist;
            };

            if (tmpData[d].Teh.length === 0) continue;

            // filter
            if (this.state.filter !== "" && 
                tmpData[d].Bike.search(this.state.filter) === -1 &&
                tmpData[d].Teh.search(this.state.filter) === -1 &&
                date.search(this.state.filter) === -1) continue;

            techRowsCount++;

            result += "<tr key='" + tmpData[d].Id + "' class='cellTechData'><td width='10%' align='center' class='colorblue textBold'>" + date +
                "</td><td width='20%' align='center' class='textBold'>" + tmpData[d].Bike +
                "</td><td width='60%' align='justify'>" + tmpData[d].Teh +
                "</td><td width='10%' align='right' class='colorred textBold'>" + odoTehDist.toFixed(2) +
                " km</td></tr>";
        }
        return result + "</tbody>";
    }

    componentDidUpdate() {
        this.tdayInit();
    }

    componentDidMount() {
        this.tdayInit();
    }

    /**
     * Init day click
     * @return {[type]} [description]
     */
    tdayInit() {

        let list = document.getElementsByClassName("cellTechData");
        if (list) {
            for (let a = 0 ; a < list.length ; a++) {
                list[a].onclick = () => {
                    eventFire(document.getElementById('cal' + list[a].getAttribute("key")), 'click');
                };
            }
        }
    }

    /**
     * Reder
     * @returns {*}
     */
    render() {

        let techTable = this.buildData();

        return (
            <div>
                <input name="filter" onChange={this.handleInputChange} placeholder="Filter"/>&nbsp;<b>Rows: {techRowsCount}</b>
                <div className="dataList">
                    <table className="dataListTable" dangerouslySetInnerHTML={{__html: techTable}}/>
                </div>
            </div>
        )
    }
}

export default TechDataTable