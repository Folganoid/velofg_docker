import React, {Component} from 'react'
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import NameForm from './auth/nameForm';
import RegForm from './auth/regForm';
import ProfForm from './auth/profForm';
import Alert from './elements/alert';
import axios from 'axios';
import SETUP from './config'
import MapContainer from './pages/markers'
import Statistic from "./pages/statistic";
import Data from "./pages/data";

/**
 *  Router and navbar
 */
class MainRouter extends Component {

    /**
     * Construct
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            checkToken: false,
            login: '',
            pass: '',
            name: '',
            userId: 0,
            year: 0,
            token: '',
            allow_map : 0,
            markers: [],
            alertMessage: "",
            alertType: "uk-alert-primary",
        };

        this.changeAlert = this.changeAlert.bind(this);
        this.userChange = this.userChange.bind(this);
        this.logOut = this.logOut.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getUserByToken = this.getUserByToken.bind(this);

        this.Marks = (props) => <MapContainer done={this.changeAlert} state={this.state} match={props.match} />;
        this.Stats = (props) => <Statistic done={this.changeAlert} state={this.state} match={props.match} />;
        this.Data = () => <Data done={this.changeAlert} state={this.state} />;
    }

    /**
     * show alert message
     *
     * @param msg
     * @param type
     */
    changeAlert(msg, type = "uk-alert-primary") {
        this.setState({alertMessage: msg});
        this.setState({alertType: type});

        setTimeout(() => this.setState({alertMessage: ""}), 3000);
    };

    /**
     * user change
     *
     * @param login
     * @param userId
     */
    userChange(data) {

        this.setState({login: data.Login});
        this.setState({userId: data.Id});
        this.setState({email: data.Email});
        this.setState({name: data.Name});
        this.setState({year: data.Year});
        this.setState({token: data.Token});
        this.setState({allow_map : data.Allow_map});
        this.setState({allow_stat : data.Allow_stat});

        this.deleteAllCookies();
        document.cookie = "t=" + data.Token;
        this.changeAlert("Welcome " + data.Login);
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

    /**
     * logout
     *
     */
    logOut() {
        this.setState({login: ''});
        this.setState({userId: 0});
        this.setState({token: 0});
        this.setState({markers: []});

        this.deleteAllCookies();
        localStorage.clear();
    }

    /**
     * Login form submit
     * @param event
     */
    handleSubmit(event) {

        let formData = new FormData();
        formData.append('login', this.state.login);
        formData.append('pass', this.state.pass);

        let that = this;
        axios({
            method: 'post',
            url: SETUP.goHost + '/user',
            data: formData,

            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
                that.userChange(response.data);
        }).catch((error) => {
            if (error.response) {
                that.changeAlert("Login or password is incorrect ", "uk-alert-danger");
            }
        });

        event.preventDefault();
    }

    getUserByToken() {
        let formData = new FormData();
        formData.append('token', document.cookie.substr(2));
        let that = this;
        axios({
            method: 'post',
            url: SETUP.goHost + '/token',
            data: formData,

            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.userChange(response.data)
        }).catch((error) => {
            localStorage.clear();
            if (error.response) {
                console.log("-");
            }
        });
        this.setState({
            checkToken: true,
        })
    }

    deleteAllCookies() {
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }

    /**
     * RENDER
     *
     * @returns {*}
     */
    render() {

        let Register = () => <RegForm done={this.changeAlert} />;
        let Profile = () => <ProfForm done={this.changeAlert} user={this.state} />;

        if(this.state.userId === 0 && this.state.checkToken === false) this.getUserByToken();

        return (
            <Router>
                <div>
                    <nav className="uk-navbar-container uk-grid" uk-navbar={"boundary-align: true; align: center;"}>
                        <div className="uk-navbar-left uk-width-1-2@m uk-width-1-1@s">
                            <ul className="uk-navbar-nav">
                                <li className="uk-parent"><Link to="/">Home</Link></li>
                                <li className="uk-parent"><Link to="/map">Map</Link></li>
                                <li className="uk-parent"><Link to="/stat">Statistic</Link></li>
                                <li className="uk-parent"><Link to="/data">Data</Link></li>
                            </ul>
                        </div>
                        <NameForm userLogin={this.state.login} passChange={this.handleInputChange} loginChange={this.handleInputChange} handleSubmit={this.handleSubmit} logOut={this.logOut} userId={this.state.userId}/>
                    </nav>
                    <Alert alertMessage={this.state.alertMessage} alertType={this.state.alertType}/>
                    <div className="uk-container">
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route exact path="/map" component={this.Marks}/>
                            <Route path='/map/:userLoginFor' component={this.Marks}/>
                            <Route exact path="/stat" component={this.Stats}/>
                            <Route path='/stat/:userLoginFor' component={this.Stats}/>
                            <Route exact path="/register" component={Register}/>
                            <Route exact path="/profile" component={Profile}/>
                            <Route exact path="/data" component={this.Data} />
                            <Route render={() => <h1>Page not found</h1>}/>
                        </Switch>
                    </div>
                </div>
            </Router>
        )
    }
}

//temp
const Home = () => <h1>Hello from Home!</h1>;

export default MainRouter


