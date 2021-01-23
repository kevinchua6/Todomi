import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './Home'

const App = () => {
    return (
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/todos/:todo_id" component={Home}/>
        </Switch>
    );
}
export default App;
