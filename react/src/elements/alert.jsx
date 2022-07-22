import React from 'react';

class Alert extends React.Component {
    render() {
        let style = (this.props.alertMessage !== "") ? {} : {display: 'none'};

            return (
                <div id="alert" style={style} className={this.props.alertType} uk-alert="true">
                    <a className="uk-alert-close" uk-close="true"></a>
                    <p>{this.props.alertMessage}</p>
                </div>
            )
    }
}

export default Alert
