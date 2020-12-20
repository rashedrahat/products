import React from 'react';
import {Link} from "react-router-dom";
import Navbar from "../layout/Navbar";
import axios from "axios";
import SweetAlert from 'react-bootstrap-sweetalert';
import {withSnackbar} from 'notistack';

class Products extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            productIdToDel: null,
            products: []
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

    fetchProductList = () => {
        const token = localStorage.getItem("userAuthToken");

        const apiEndpoint = process.env.REACT_APP_API_ENDPOINT ? process.env.REACT_APP_API_ENDPOINT : 'http://127.0.0.1:8000/api/'
        axios.get(apiEndpoint+ 'products/?token=' + token).then(response => {
            console.log(response);
            if (response.status === 200) {
                // console.log(response.data)
                this.setState({products: response.data})
            }
        }).catch(error => {
            if (error.response) {
                console.log(error.response)
                const errorMsg = error.response.data.error;
                switch (error.response.status) {
                    case 400:
                        if (errorMsg === 'token_not_provided')
                            this.props.history.push('/login')
                        break;
                    case 401:
                        if (errorMsg === 'token_expired')
                            this.props.history.push('/login')
                        break;
                    default:
                        this.handleError('Something went wrong');
                }
            }
        });
    }

    componentDidMount() {
        this.fetchProductList()
    }

    deleteProduct = (id) => {
        // console.log(id)
        this.setState({productIdToDel: id, show: true})
    }

    onCancel = () => {
        // console.log(id)
        this.setState({productIdToDel: null, show: false})
    }

    onConfirm = () => {
        // console.log(id)
        this.setState({show: false}, () => {
            const token = localStorage.getItem("userAuthToken");

            const headers = {
                'Content-Type': 'multipart/form-data',
            };
            let form_data = new FormData();
            form_data.append('_method', 'DELETE');

            const apiEndpoint = process.env.REACT_APP_API_ENDPOINT ? process.env.REACT_APP_API_ENDPOINT : 'http://127.0.0.1:8000/api/'
            axios.post(apiEndpoint + 'products/' + this.state.productIdToDel + '?token=' + token, form_data, {headers: headers}).then(response => {
                console.log(response);
                if (response.status === 200 && response.data.success) {
                    console.log(response.data.data)
                    this.setState({productIdToDel: null})
                    this.handleSuccess(response.data.message)
                    this.fetchProductList()
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
        })
    }

    render() {
        const {products} = this.state;
        return (
            <div>
                <Navbar/>
                <div className="container">
                    <div className="py-4">
                        <h1>List of Products</h1>
                        <table className="table border shadow">
                            <thead className="thead-light">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Title</th>
                                <th scope="col">Price</th>
                                <th scope="col">Image</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.length > 0 &&
                            <>
                                {
                                    products.map((product, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{product.title}</td>
                                            <td>${product.price}</td>
                                            <td>
                                                <img
                                                    src={process.env.REACT_APP_IMAGE_ENDPOINT ?
                                                        process.env.REACT_APP_IMAGE_ENDPOINT + product.image_name
                                                        : 'http://127.0.0.1:8000/storage/images/' + product.image_name}
                                                    className="rounded-circle" alt={product.image_name}
                                                    style={{width: '50px', height: '50px'}}/>
                                            </td>
                                            <td>
                                                <Link className="btn btn-primary mr-2" to={`/products/${product.id}`}>
                                                    View
                                                </Link>
                                                <Link
                                                    className="btn btn-outline-primary mr-2"
                                                    to={`/products/edit/${product.id}`}
                                                >
                                                    Edit
                                                </Link>
                                                <button className="btn btn-danger"
                                                        onClick={() => this.deleteProduct(product.id)}>Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </>
                            }

                            {products.length === 0 && <tr>
                                <td colSpan={5}>No products found.</td>
                            </tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
                <SweetAlert
                    show={this.state.show}
                    warning
                    showCancel
                    confirmBtnText="Yes, delete it!"
                    confirmBtnBsStyle="danger"
                    title="Are you sure?"
                    onConfirm={this.onConfirm}
                    onCancel={this.onCancel}
                    focusCancelBtn
                >
                    You will not be able to recover this product!
                </SweetAlert>
            </div>
        );
    }
}

export default withSnackbar(Products)
