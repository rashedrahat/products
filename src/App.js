import React from "react";
import {
    BrowserRouter as Router, Redirect,
    Switch
} from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.css";

import ROUTES from "./routes";

import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";

import PublicComponents from "./components/public";
import PrivateComponents from "./components/private";

function App() {
    return (
        <Router>
                <Switch>
                    <PublicRoute exact path={ROUTES.LOGIN} component={PublicComponents.Login}/>
                    <PublicRoute eaxct path={ROUTES.REGISTER} component={PublicComponents.Register}/>

                    <PrivateRoute exact path={ROUTES.PRODUCTS} component={PrivateComponents.Products}/>
                    <PrivateRoute exact path={ROUTES.ADD_PRODUCT} component={PrivateComponents.AddProduct}/>
                    <PrivateRoute exact path={ROUTES.EDIT_PRODUCT} component={PrivateComponents.EditProduct}/>
                    <PrivateRoute exact path={ROUTES.PRODUCT} component={PrivateComponents.Product}/>
                    <PrivateRoute exact path={ROUTES.PRODUCT} component={PrivateComponents.Product}/>

                    <Redirect to={ROUTES.LOGIN}/>
                </Switch>
        </Router>
    );
}

export default App;
