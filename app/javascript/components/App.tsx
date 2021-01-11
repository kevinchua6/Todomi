import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Todos from './Todo-Main/Todos'
import Todo from './Todo-Subtask/Todo'

const App = () => {

    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };

    return (
        <Switch>
            <Route exact path="/" render={(props) => ( 
                <Todos {...props} 
                open={open} 
                handleDrawerOpen={handleDrawerOpen}
                handleDrawerClose={handleDrawerClose}  />)}/>

            <Route exact path="/todos/:todo_id"  render={(props) => ( 
                <Todo {...props} 
                open={open} 
                handleDrawerOpen={handleDrawerOpen}
                handleDrawerClose={handleDrawerClose}  />)}/>
        </Switch>
    )
}
export default App