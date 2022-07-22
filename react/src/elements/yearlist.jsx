import React from 'react';

class YearList extends React.Component {

    /**
     * get odolist by year
     *
     * @param year
     * @returns {string}
     */
    getByYear(year) {
        let result = "";
        for (var k in this.props.data) {
            if (typeof this.props.data[k] !== 'function') {
                if (this.props.data[k][year] > 0) {
                    result += "<tr class='"+ ((k === "TOTAL") ? "textBold colorred" : "") +"'><td width='60%'>" + k + ":</td><td width='40%' align='right'>" + this.props.data[k][year] + ((+this.props.data[k][year]%1 === 0) ? ".00" : "") + " km</td></tr>";
                }
            }
        }
    return result;
    }

    render() {

        let ylist = this.props.years.map((year, i) => {
            return (<div key={i}>
                <dd><b className="colorblue">{year}</b></dd>
                <table style={{width: '90%'}} dangerouslySetInnerHTML={{__html: this.getByYear(year)}}/>
                <br />
                </div>)
        });

        let totalOdo = (total) => {
            let res = 0;
            for (let d in total) {
                res += total[d];
            };

            return res;
        };

        return (
            <div>
                <h4 align="center">Total:</h4>
            <div className="odoList">
                {ylist}
            </div>
                <hr />
                <dd>Total years: <span className="colorblue textBold">{ylist.length}</span></dd>
                <dd>Average dist on year: <span className="colorred textBold">{(totalOdo(this.props.data.TOTAL)/ylist.length).toFixed(2)} km</span></dd>
            </div>
        )
    }
}

export default YearList