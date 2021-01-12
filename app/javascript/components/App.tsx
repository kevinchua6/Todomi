import React, { useState, useEffect, Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import Todos from './Todo-Main/Todos'
import Todo from './Todo-Subtask/Todo'

const App = () => {

    const [open, setOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const handleDrawerOpen = () => {
      setOpen(true)
    }
  
    const handleDrawerClose = () => {
      setOpen(false)
    }

    // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => { setSearchInput({title: e.target.value}) }

    return (
        <Switch>
            <Route exact path="/" render={(props) => ( 
                <Todos {...props} 
                open={open} 
                handleDrawerOpen={handleDrawerOpen}
                handleDrawerClose={handleDrawerClose}
                setSearchInput={setSearchInput}
                searchInput={searchInput}  
                />)}
              />

            <Route exact path="/todos/:todo_id"  render={(props) => ( 
                <Todo {...props} 
                open={open} 
                handleDrawerOpen={handleDrawerOpen}
                handleDrawerClose={handleDrawerClose}
                setSearchInput={setSearchInput}
                searchInput={searchInput}
                />)}
            />
        </Switch>
    )
}
export default App