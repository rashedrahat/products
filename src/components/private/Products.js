import React from 'react';
import {Link} from "react-router-dom";
import Navbar from "../layout/Navbar";
import axios from "axios";

class Products extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        };
    }

    componentDidMount() {
        const token = localStorage.getItem("userAuthToken");
        axios.get(process.env.REACT_APP_API_ENDPOINT + 'products/?token=' + token).then(response => {
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

    deleteProduct = (id) => {
        console.log(id)
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
                                                    src={process.env.REACT_APP_IMAGE_ENDPOINT || 'http://127.0.0.1:8000/storage/images/' ?
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
            </div>
        );
    }
}

export default Products
