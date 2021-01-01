import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Todos from './Todo-Main/Todos'
import Todo from './Todo-Subtask/Todo'

const App = () => {
    return (
        <Switch>
            <Route exact path="/" component={Todos}/>
            <Route exact path="/todos/:todo_id" component={Todo}/>
        </Switch>
    )
}
export default App