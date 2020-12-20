import React from 'react';
import Navbar from "../layout/Navbar";
import axios from "axios";
import $ from "jquery";
import {withSnackbar} from 'notistack';

class AddProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data_to_post: {
                title: '',
                description: '',
                price: '',
            },
            imagePreviewUrl: ''
        };

        this.fileInput = React.createRef();
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
            'Content-Type': 'multipart/form-data',
        };

        let form_data = new FormData();
        form_data.append('title', this.state.data_to_post.title);
        form_data.append('description', this.state.data_to_post.description);
        form_data.append('price', this.state.data_to_post.price);
        form_data.append('image', this.fileInput.current.files[0]);

        const token = localStorage.getItem("userAuthToken");

        axios.post(process.env.REACT_APP_API_ENDPOINT + 'products?token=' + token, form_data, {headers: headers}).then(response => {
            console.log(response);
            if (response.status === 200 && response.data.success) {
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

    filePreviewHandler = (e) => {
        $('#' + e.target.name + "-val-err-msg").text('')
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                imagePreviewUrl: reader.result
            });
        }

        reader.readAsDataURL(file)
    };

    render() {
        return (
            <div>
                <Navbar/>
                <div className="container">
                    <div className="w-75 mx-auto shadow p-5">
                        <h2 className="text-center mb-4">Add a Product</h2>
                        <form onSubmit={this.formSubmitHandler}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="Enter Title"
                                    name="title" value={this.state.data_to_post.title}
                                    onChange={this.inputChangeHandler} required
                                />
                                <small className="text-danger" id="title-val-err-msg"></small>
                            </div>
                            <div className="form-group">
                                <textarea
                                    className="form-control form-control-lg"
                                    placeholder="Write something about this product..."
                                    name="description" onChange={this.inputChangeHandler} value={this.state.data_to_post.description}
                                    required></textarea>
                                <small className="text-danger" id="description-val-err-msg"></small>
                            </div>
                            <div className="form-group">
                                <input
                                    type="number" min={1}
                                    className="form-control form-control-lg"
                                    placeholder="Enter Price" value={this.state.data_to_post.price}
                                    name="price" onChange={this.inputChangeHandler} required
                                />
                                <small className="text-danger" id="price-val-err-msg"></small>
                            </div>
                            <div className="form-group">
                                <div className="custom-file">
                                    <input type="file" name="image"
                                           className="form-control form-control-lg custom-file-input"
                                           ref={this.fileInput} onChange={this.filePreviewHandler} required/>
                                    <label className="custom-file-label">Choose file</label>
                                </div>
                                <small className="text-danger" id="image-val-err-msg"></small>
                            </div>
                            <div align="center" style={this.state.imagePreviewUrl ? {display: 'block'} : {display: 'none'}} className="mb-3">
                                <img
                                    src={this.state.imagePreviewUrl}
                                    className="img-thumbnail img-fluid" style={{
                                    maxWidth: '33%',
                                    height: 'auto'
                                }}/>
                            </div>
                            <button className="btn btn-primary btn-block" type='submit'>Add</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withSnackbar(AddProduct)
