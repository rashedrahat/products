import React from 'react';
import {Link} from "react-router-dom";
import Navbar from "../layout/Navbar";
import axios from "axios";
import { withSnackbar } from 'notistack';

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product: {}
        };
    }

    handleError(msg) {
        this.key = this.props.enqueueSnackbar(msg, {
            variant: 'error',
            autoHideDuration: 2000,
        });
    }

    componentDidMount() {
        const token = localStorage.getItem("userAuthToken");
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'products/' + this.props.match.params.id + '?token=' + token).then(response => {
            console.log(response);
            if (response.status === 200 && response.data.success) {
                console.log(response.data.data)
                this.setState({product: response.data.data})
            }
        }).catch(error => {
            if (error.response) {
                console.log(error.response)
                const errorMsg = error.response.data.error;
                switch (error.response.status) {
                    case 400:
                        if (errorMsg === 'token_not_provided') {
                            localStorage.clear();
                            this.props.history.push('/login')
                        } else {
                            this.handleError(error.response.data.message);
                            this.props.history.push('/products')
                        }
                        break;
                    case 401:
                        if (errorMsg === 'token_expired')
                            localStorage.clear();
                            this.props.history.push('/login')
                        break;
                    default:
                        this.handleError('Something went wrong');
                }
            }
        });
    }

    render() {
        const imgAPIEndpoint = process.env.REACT_APP_IMAGE_ENDPOINT ? process.env.REACT_APP_IMAGE_ENDPOINT : 'http://127.0.0.1:8000/storage/images/'
        return (
            <div>
                <Navbar/>
                <div className="container">
                    <div className="container py-4">
                        <Link className="btn btn-primary btn-sm" to="/products">
                            Go Back
                        </Link>
                        <h1 className="display-4">{this.state.product.title}</h1>
                        <h6><b>Price:</b> ${this.state.product.price}</h6>
                        <hr/>
                        <div className="row">
                            <div className="col-8">
                                <p><small>Description</small></p>
                                <p className="text-muted">
                                    {this.state.product.description}
                                </p>
                            </div>
                            <div className="col-4">
                                <img
                                    src={imgAPIEndpoint + this.state.product.image_name}
                                    className="img-thumbnail img-fluid"
                                    alt={this.state.product.image_name} style={{
                                    maxWidth: '100%',
                                    height: 'auto'
                                }}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withSnackbar(Product)
