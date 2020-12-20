import React from 'react';
import {Route, Redirect, withRouter} from 'react-router-dom';


const PublicRoute = ({component: Component, path}) => {
    let isAuthenticated = false;
    if (localStorage.getItem("userAuthToken")) {
        isAuthenticated = true;
    }
    return (
        <Route exact path={path}
               render={props => (isAuthenticated ? <Redirect to="/products"/> : <Component {...props} />)}/>
    )
};

export default withRouter(PublicRoute);
