import React from "react";
import {Redirect, Link} from "react-router-dom";
import ROUTES from "../../routes";
import {withSnackbar} from 'notistack';
import axios from "axios";

class Navbar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            unauthorized: false,
            forceToLogin: false
        }
    }

    handleSuccess(msg) {
        this.key = this.props.enqueueSnackbar(msg, {
            variant: 'success',
            autoHideDuration: 2000,
        });
    }

    handleError(msg) {
        this.key = this.props.enqueueSnackbar(msg, {
            variant: 'error',
            autoHideDuration: 2000,
        });
    }

    forceToLogin() {
        this.setState({unauthorized: true, forceToLogin: true}, () => {
            localStorage.clear();
        })
        this.handleError('You are not authorized for selected action. PLease login to continue.');
    }

    logOut = () => {
        const token = localStorage.getItem("userAuthToken");
        if (token) {
            const apiEndpoint = process.env.REACT_APP_API_ENDPOINT ? process.env.REACT_APP_API_ENDPOINT : 'http://127.0.0.1:8000/api/'

            axios.get(apiEndpoint + 'logout/?token=' + token).then(response => {
                console.log(response);
                if (response.status === 200 && response.data.success) {
                    localStorage.clear();
                    this.setState({forceToLogin: true})
                    this.handleSuccess(response.data.message);
                }
            }).catch(error => {
                if (error.response) {
                    console.log(error.response)
                    const errorMsg = error.response.data.error;
                    switch (error.response.status) {
                        case 400:
                            if (errorMsg === 'token_not_provided')
                                this.forceToLogin()
                            break;
                        case 401:
                            if (errorMsg === 'token_expired')
                                this.forceToLogin()
                            break;
                        default:
                            this.handleError('Something went wrong');
                    }
                }
            });
        } else {
            this.setState({unauthorized: true, forceToLogin: true})
            this.handleError('You are not authorized for selected action. PLease login to continue.');
        }
    }

    render() {
        let isLoggedIn = false;
        if (localStorage.getItem("userAuthToken")) {
            isLoggedIn = true;
        }

        if (this.state.unauthorized || this.state.forceToLogin) {
            return (
                <>
                    <Redirect to='/login'/>
                </>
            )
        } else {
            return (
                <nav className="navbar navbar-dark bg-primary">
                    <div className="container">
                        <Link className="btn btn-outline-light float-right" to={ROUTES.LOGIN}
                              style={!isLoggedIn ? {display: 'block'} : {display: 'none'}}>Login</Link>
                        <Link className="btn btn-outline-light float-right" to={ROUTES.REGISTER}
                              style={!isLoggedIn ? {display: 'block'} : {display: 'none'}}>Register</Link>
                        <Link className="btn btn-outline-light" to={ROUTES.ADD_PRODUCT}
                              style={isLoggedIn ? {display: 'block'} : {display: 'none'}}>Add Product</Link>
                        <button className="btn btn-outline-light"
                                style={isLoggedIn ? {display: 'block'} : {display: 'none'}} onClick={this.logOut}>Log
                            out
                        </button>
                    </div>
                </nav>
            );
        }
    }
}

export default withSnackbar(Navbar);
