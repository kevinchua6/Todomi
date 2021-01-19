import React, { useState, useEffect, Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import Todos from './Todo-Main/Todos'
import Todo from './Todo-Subtask/Todo'

export interface Tag {
  id: string,
  type: string,
  attributes: {
      name: string,
      todo_id: number
  }
}

const App = () => {

    const [searchInput, setSearchInput] = useState("");
    const [tagsChkbox, setTagsChkbox] = useState({})
    const [tags, setTags] = useState<Tag[]>([])

    const sidebarAllTodoHandleClick = () => { 
      const newTagsChkbox = {}
      for (const [key, value] of Object.entries(tagsChkbox)){
          newTagsChkbox[key] = false
      }
      setTagsChkbox(newTagsChkbox)
  }


    // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => { setSearchInput({title: e.target.value}) }

    return (
        <Switch>
            <Route exact path="/" render={(props) => ( 
                <Todos {...props} 
                  setSearchInput={setSearchInput}
                  searchInput={searchInput} 

                  tagsChkbox={tagsChkbox}
                  setTagsChkbox={setTagsChkbox}
                  tags={tags}
                  setTags={setTags}

                  sidebarAllTodoHandleClick={sidebarAllTodoHandleClick}
                />)}
              />

            <Route exact path="/todos/:todo_id"  render={(props) => ( 
                <Todo {...props} 
                  setSearchInput={setSearchInput}
                  searchInput={searchInput}

                  tagsChkbox={tagsChkbox}
                  setTagsChkbox={setTagsChkbox}
                  tags={tags}
                  setTags={setTags}

                  sidebarAllTodoHandleClick={sidebarAllTodoHandleClick}
                />)}
            />
        </Switch>
    )
}
export default App
