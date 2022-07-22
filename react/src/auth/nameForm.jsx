import React from 'react';
import {Link} from 'react-router-dom';

/**
 * Auth form
 */
class NameForm extends React.Component {

    /**
     * RENDER
     * @returns {*}
     */
    render() {

        let login;

        if (this.props.userId === 0) {
            login = <div className="uk-navbar-right uk-width-1-2@m uk-width-1-1@s">
                <div className="uk-navbar-item">
                    <input className="uk-input uk-form-width-small" name="login" type="text" size="5"
                           placeholder="login" onChange={this.props.loginChange}/>
                    <input className="uk-input uk-form-width-small" name="pass" type="password" size="5"
                           placeholder="pass" onChange={this.props.passChange}/>
                </div>
                <div className="uk-navbar-item">
                    <button className="uk-button uk-button-default" type="submit"
                            onClick={this.props.handleSubmit}>Login
                    </button>
                </div>
                <div className="uk-navbar-item">
                    <Link to="/register">Registration</Link>
                </div>
            </div>;
        } else {
            login = <div className="uk-navbar-right uk-width-1-2@m uk-width-1-1@s">
                <div className="uk-navbar-item">
                    <Link to="/profile"><span uk-icon="icon: user"></span> <b>{this.props.userLogin}</b></Link>
                </div>
                <ul className="uk-navbar-nav">
                    <li className="uk-navbar-content ifLogin">
                        <button className="uk-button uk-button-default" type="reset" onClick={this.props.logOut}>Logout
                        </button>
                    </li>
                </ul>
            </div>;
        }

        return login;
    }
}

export default NameForm