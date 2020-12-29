import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Todos from './Todo-Main/Todos'
import Subtask from './Todo-Subtask/Subtask'

const App = () => {
    return (
        <Switch>
            <Route exact path="/" component={Todos}/>
            <Route exact path="/todos/:todo_id" component={Subtask}/>
        </Switch>
    )
}
export default App