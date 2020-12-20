import React from 'react';
import axios from 'axios';
import qs from 'qs';
import Navbar from "../layout/Navbar";
import {withSnackbar} from 'notistack';
import $ from "jquery";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data_to_post: {
                email: '',
                password: '',
            },
        };
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

    formSubmitHandler = (e) => {
        e.preventDefault();
        // console.log(this.state.data_to_post);
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        const data = qs.stringify(this.state.data_to_post);
        // console.log(data);
        const apiEndpoint = process.env.REACT_APP_API_ENDPOINT ? process.env.REACT_APP_API_ENDPOINT : 'http://127.0.0.1:8000/api/'
        axios.post(apiEndpoint + 'login', data, {headers: headers}).then(response => {
            console.log(response);
            if (response.status === 200 && response.data.success) {
                localStorage.setItem('userAuthToken', response.data.token);
                this.props.history.push('/products');
                this.handleSuccess(response.data.message);
            }
        }).catch(error => {
            if (error.response) {
                console.log(error.response)
                switch (error.response.status) {
                    case 400:
                        // console.log(error.response.data.error)
                        const errors = error.response.data.error;
                        for (const property in errors) {
                            // console.log(`${property}: ${errors[property]}`);
                            $('#' + property + "-val-err-msg").text(errors[property])
                        }
                        break;
                    case 401:
                        this.handleError(error.response.data.message);
                        break;
                    default:
                        this.handleError('Something went wrong');
                }
            }
        });
    };

    inputChangeHandler = (e) => {
        $('#' + e.target.name + "-val-err-msg").text('')
        let obj = this.state.data_to_post;
        obj[e.target.name] = e.target.value;
        this.setState({data_to_post: obj});
    };

    render() {
        return (
            <div>
                <Navbar/>
                <div className="container">
                    <div className="w-75 mx-auto shadow p-5">
                        <h2 className="text-center mb-4">Login to your account</h2>
                        <form onSubmit={this.formSubmitHandler}>
                            <div className="form-group">
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    placeholder="Enter Your E-mail Address" value={this.state.data_to_post.email}
                                    name="email" onChange={this.inputChangeHandler}
                                />
                                <small className="text-danger" id="email-val-err-msg"></small>
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    className="form-control form-control-lg"
                                    placeholder="Enter Your Password" value={this.state.data_to_post.password}
                                    name="password" onChange={this.inputChangeHandler}
                                />
                                <small className="text-danger" id="password-val-err-msg"></small>
                            </div>
                            <button className="btn btn-primary btn-block" type='submit'>Login</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withSnackbar(Login);
