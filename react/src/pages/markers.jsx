import React from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import SETUP from "../config";
import axios from 'axios';

export class MapContainer extends React.Component {

    constructor(props) {

        let markers = (localStorage.getItem('markers')) ? JSON.parse(localStorage.getItem('markers')) : [];
        let foreign = (props.match.params.userLoginFor !== undefined && props.match.params.userLoginFor.length > 0) ? props.match.params.userLoginFor : "";

        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            markers: markers,
            filter: "",
            centerMap: {lat: 50.9129663, lng: 34.8055385},
            color: "reset",

            addName: "",
            addSubName: "",
            addCoord: "",
            addLink: "",
            addColor: "",
            addId: "",

            foreign: foreign
        };

        this.onMapClicked = this.onMapClicked.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.getMarker = this.getMarker.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getForeignMarker = this.getForeignMarker.bind(this);
        this.colorFilter = this.colorFilter.bind(this);
        this.listMarkerClick = this.listMarkerClick.bind(this);
        this.saveMarker = this.saveMarker.bind(this);
        this.updateMarker = this.updateMarker.bind(this);
        this.deleteMarker = this.deleteMarker.bind(this);
        this.clearAddFields = this.clearAddFields.bind(this);
        this.eventHandler = this.eventHandler.bind(this);

        if (foreign !== "") this.getForeignMarker();
        else if (!localStorage.getItem('markers')) this.getMarker();
    }

    eventHandler(e) {
        if (e.type === 'click' && !e.target.matches('.addMarker *')) {
            this.clearAddFields();
        }
    }

    /**
     * map click
     * @param props
     */
    onMapClicked (props) {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null,
            });
            this.clearAddFields();
        }
    };

    /**
     * marker click
     *
     * @param props
     * @param marker
     * @param e
     */
    onMarkerClick (props, marker, e) {
        document.getElementById("main_body").removeEventListener("click", this.eventHandler, false);
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
            addName: marker.name,
            addSubName: marker.subname,
            addCoord: marker.x + ", " + marker.y,
            addLink: marker.link,
            addColor: marker.color,
            addId: marker.id,
        });
    };

    onMouseoverMarker (props, marker, e) {
        marker.setAnimation(props.google.maps.Animation.BOUNCE);
        setTimeout(() => {marker.setAnimation(null)}, 3000);
    }

    /**
     * get markers
     */
    getMarker() {

        let formData = new FormData();
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);

        let that = this;

        axios({
            method: 'post',
            url: SETUP.goHost + '/get_markers',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.setState({markers: response.data});
            localStorage.setItem('markers', JSON.stringify(response.data));
        }).catch((error) => {
            if (error.response) {
                that.props.done("Markers not found!", "uk-alert-warning");
            }
        });
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
    }

    /**
     * get markers by login
     */
    getForeignMarker() {

        let formData = new FormData();

        let login;
        if (this.state.foreign !== "") login = this.state.foreign;
        if (document.getElementById("foreign")) login = document.getElementById("foreign").value;
        formData.append('login', login);
        let that = this;

        axios({
            method: 'post',
            url: SETUP.goHost + '/get_foreign_markers',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.setState({markers: response.data});
        }).catch((error) => {
            if (error.response) {
                that.props.done("Markers not found!", "uk-alert-warning");
            }
        });
    }

    /**
     * set color filter
     * @param str
     */
    colorFilter(str) {
        this.setState({color: str});
    }

    /**
     * list marker click
     * @param str
     */
    listMarkerClick(data) {
        this.setState({
            centerMap: {lat: data.X, lng: data.Y},
            activeMarker: null,
            showingInfoWindow: false,

            addName: data.Name,
            addSubName: data.Subname,
            addCoord: data.X + ", " + data.Y,
            addLink: data.Link,
            addColor: data.Color,
            addId: data.Id,
        });
        document.getElementById("main_body").addEventListener("click", this.eventHandler, false);
    }

    clearAddFields() {
        this.setState({
            addName: "",
            addSubName: "",
            addCoord: "",
            addLink: "",
            addColor: "",
            addId: "",
        });
        document.getElementById("main_body").removeEventListener("click", this.eventHandler, false);
    }

    /**
     * Save Marker
     */
    saveMarker() {

        let formData = new FormData();
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);
        formData.append('name', this.state.addName);
        formData.append('subname', this.state.addSubName);
        formData.append('coord', this.state.addCoord);
        formData.append('link', this.state.addLink);
        formData.append('color', this.state.addColor);

        let that = this;

        axios({
            method: 'POST',
            url: SETUP.goHost + '/marker',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.props.done("Successful", "uk-alert-primary");
        }).catch((error) => {
            if (error.response) {
                that.props.done("ERROR! Can't save marker.", "uk-alert-warning");
            }
        });
    }

    /**
     * Update marker
     */
    updateMarker() {
        let formData = new FormData();
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);
        formData.append('name', this.state.addName);
        formData.append('subname', this.state.addSubName);
        formData.append('coord', this.state.addCoord);
        formData.append('link', this.state.addLink);
        formData.append('color', this.state.addColor);
        formData.append('id', this.state.addId);

        let that = this;

        axios({
            method: 'PUT',
            url: SETUP.goHost + '/marker',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.props.done("Successful", "uk-alert-primary");
        }).catch((error) => {
            if (error.response) {
                that.props.done("ERROR! Can't update marker.", "uk-alert-warning");
            }
        });
    }

    /**
     * Delete marker
     */
    deleteMarker() {
        let formData = new FormData();
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);
        formData.append('id', this.state.addId);

        let that = this;

        axios({
            method: 'DELETE',
            url: SETUP.goHost + '/marker',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },
        }).then(function (response) {
            that.props.done("Successful", "uk-alert-primary");
        }).catch((error) => {
            if (error.response) {
                that.props.done("ERROR! Can't delete marker.", "uk-alert-warning");
            }
        });
    }

    /**
     * RENDER
     * @returns {*}
     */
    render() {

        // sort
        let sortObj = [...this.state.markers];
        sortObj.sort((a,b) => {
            if(a.Name < b.Name) return -1;
            if(a.Name > b.Name) return 1;
            return 0;
        });

        //filter
        let filteredObj = [];
        sortObj = sortObj.map((answer, i) => {
            let color = (this.state.color !== "reset" && answer.Color !== this.state.color) ? false : true;

            if (answer.Name.toLowerCase().indexOf(this.state.filter.toLowerCase()) >= 0 && color) {
                filteredObj.push(answer);
            };
        });


        // make marker template
        let list = filteredObj.map((answer, i) => {
            let m = (<Marker key={i}
                id={answer.Id}
                name={answer.Name}
                subname={answer.Subname}
                x={answer.X}
                y={answer.Y}
                link={answer.Link}
                color={answer.Color}
                position={{lat: answer.X, lng: answer.Y}}
                icon={{
                    path: this.props.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    strokeColor: answer.Color,
                    scale: 5
                }}
                onClick={this.onMarkerClick}
                onMouseover={this.onMouseoverMarker}
            />);
            return m;
        });



        // make list template
        let listTable = filteredObj.map((answer, i) => {
            return (
                <tr className={'listMarkers'} key={i} onClick={this.listMarkerClick.bind(this, answer)}>
                    <td style={{color: answer.Color}}>{answer.Name}</td>
                    <td>{answer.X}</td><td>{answer.Y}</td>
                    <td><a href={answer.Link}>Link...</a></td>
                </tr>
            )
        });

        // subname
        let subname = "";
        if (this.state.selectedPlace.subname !== "") {
            subname = <h4>{this.state.selectedPlace.subname}</h4>;
        };

        let colors = ["red", "blue", "green", "orange", "purple", "reset"];
        colors = colors.map((answer, i) => {
            return (<button key={i} value={answer} onClick={this.colorFilter.bind(this, answer)}>{answer}</button>);
        });

        let map = <Map
            google={this.props.google}
            style={style}
            className={'map'}
            initialCenter={this.state.centerMap}
            center={this.state.centerMap}
            zoom={12}
            onClick={this.onMapClicked}
        >
            {list}
            <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}>
                <div>
                    <div style={{width: "100%", height: "20px", backgroundColor: this.state.selectedPlace.color, padding: "0px", margin: "0px"}}></div>
                    <h3>{this.state.selectedPlace.name}</h3>
                    {subname}
                    <p>{this.state.selectedPlace.x + ", " + this.state.selectedPlace.y}</p>
                    <a target="blank" href={this.state.selectedPlace.link}>Link...</a>
                </div>
            </InfoWindow>
        </Map>

        let addMarkerButton = (this.state.addId === "") ? <button onClick={this.saveMarker}>Add NEW</button> : <span><button onClick={this.updateMarker}>Update</button><button title="Delete marker" style={{color: "red"}} onClick={this.deleteMarker}>X</button></span>

        return (<div className="uk-container">
                <h1>Map</h1>
                <div className="uk-grid">
                    <div className="uk-width-1-2@m uk-width-1-1@s" style={{height: "500px"}}>
                        Watch another map by login: <input id="foreign" type={'text'} placeholder={'Login'} /><button onClick={this.getForeignMarker}>Watch</button> <button onClick={this.getMarker}>My map</button>
                        <br />
                        {map}
                    </div>
                    <div className="uk-width-1-2@m uk-width-1-1@s">
                        <input name="filter" onChange={this.handleInputChange} placeholder="Filter"/>{colors}
                        <div style={{maxHeight: "500px", overflow: "auto"}}>
                        <table>
                            <tbody>
                            {listTable}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
                <br />

                <div className={'addMarker'}>
                Name: <input onChange={this.handleInputChange} name="addName" value={this.state.addName} placeholder="Name" />&nbsp;
                Subname: <input onChange={this.handleInputChange} name="addSubName" value={this.state.addSubName} placeholder="Subname" />&nbsp;
                Coordinates: <input onChange={this.handleInputChange} name="addCoord" value={this.state.addCoord} placeholder="Coordinates" />&nbsp;
                Link: <input onChange={this.handleInputChange} name="addLink" value={this.state.addLink} placeholder="External link" />&nbsp;
                <select onChange={this.handleInputChange} name="addColor" value={this.state.addColor}>
                    <option value='black' style={{color: "black"}}>Black</option>
                    <option value='red' style={{color: "red"}}>Red</option>
                    <option value='green' style={{color: "green"}}>Green</option>
                    <option value='blue' style={{color: "blue"}}>Blue</option>
                    <option value='orange' style={{color: "orange"}}>Orange</option>
                    <option value='grey' style={{color: "grey"}}>Grey</option>
                    <option value='purple' style={{color: "purple"}}>Purple</option>
                </select>&nbsp;
                {addMarkerButton}
                </div>
            </div>
        );
    }
}

const style = {
    width: '100%',
    height: '100%'
};

export default GoogleApiWrapper({
    apiKey: ("AIzaSyBHxesvq5UB2K2n1w4-qysrDWVHaLJlS5o")
})(MapContainer)
