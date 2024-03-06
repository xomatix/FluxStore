import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import OfferPage from "@/controllers/offerController";

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/offers/:category" component={OfferPage} />
            </Switch>
        </Router>
    );
};

export default App;