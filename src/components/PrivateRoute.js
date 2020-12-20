import React from 'react';
import {Route, Redirect, withRouter} from 'react-router-dom';
import ROUTES from "../routes";


const PrivateRoute = ({component: Component, path}) => {
    let isAuthenticated = false;
    if (localStorage.getItem("userAuthToken")) {
        isAuthenticated = true;
    }
    return (
        <Route exact path={path}
               render={props => (isAuthenticated ? <Component {...props} /> : <Redirect to={ROUTES.LOGIN} />)}/>
    )
};

export default withRouter(PrivateRoute);
