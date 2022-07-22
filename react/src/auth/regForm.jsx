import React from 'react';
import axios from 'axios';
import {withRouter} from "react-router-dom";
import SETUP from '../config';

class RegForm extends React.Component {

    /**
     * constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            name: '',
            pass: '',
            pass2: '',
            email: '',
            year: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * submit
     * @param event
     */
    handleSubmit(event) {

        if (this.state.pass === this.state.pass2) {

            let formData = new FormData();
            formData.append('login', this.state.login);
            formData.append('name', this.state.name);
            formData.append('pass', this.state.pass);
            formData.append('email', this.state.email);
            formData.append('year', this.state.year);

            let that = this;
            axios({
                method: 'post',
                url: SETUP.goHost + '/reg',
                data: formData,

                config: {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Origin': SETUP.reactHost,
                    }
                },

            }).then(function (response) {
                    that.props.done("User "+ that.state.login +" registered succesful !", "uk-alert-success");
                    that.props.history.push('/');
            }).catch((error) => {
                if (error.response) {
                    that.props.done("Data Base error ", "uk-alert-danger");
                }
            });

        }

        event.preventDefault();
    }

    /**
     * if input change
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
     * RENDER
     * @returns {*}
     */
    render() {

        let passMessage;
        if (this.state.pass === this.state.pass2) {
            passMessage = '';
        } else {
            passMessage = 'Password is not match !';
        }

        let form =
            <div>
                <h1>Registration</h1>
                <form onSubmit={this.handleSubmit}>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <label htmlFor="reg_login">Login: </label><br/>
                                <label htmlFor="reg_name">Name: </label><br/>
                                <label htmlFor="reg_email">Email: </label><br/>
                                <label htmlFor="reg_pass">Password: </label><br/>
                                <label htmlFor="reg_pass2">Confirm password: </label><br/>
                                <label htmlFor="reg_year">Year: </label><br/>
                            </td>
                            <td>
                                <input id="reg_login" name="login" placeholder="login" onChange={this.handleInputChange} /><br/>
                                <input id="reg_name" name="name" placeholder="name" onChange={this.handleInputChange} /><br/>
                                <input id="reg_email" name="email" placeholder="email" onChange={this.handleInputChange} /><br/>
                                <input id="reg_pass" name="pass" type="password" onChange={this.handleInputChange} /><br/>
                                <input id="reg_pass2" name="pass2" type="password" onChange={this.handleInputChange} /><span style={{color: 'red'}}>{passMessage}</span><br/>
                                <input id="reg_year" name="year" placeholder="year" onChange={this.handleInputChange} /><br/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <button type="submit">Send</button>
                    <button type="reset">Reset</button>
                </form>
            </div>;

        return (form);
    }
}

export default withRouter(RegForm)