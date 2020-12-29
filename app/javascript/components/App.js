import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Todos from './Todo-Main/Todos'
import TodoSubtask from './Todo-Subtask/Subtask'

const App = () => {
    return (
        <Switch>
            <Route exact path="/" component={Todos}/>
            <Route exact path="/todos/:todo_id" component={TodoSubtask}/>
        </Switch>
    )
}
export default App