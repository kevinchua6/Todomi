import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import Todo from './Todo'
import TodoInput from './TodoInput'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'

//Style
const Home = styled.div`
    text-align: center;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
`

const Header = styled.div`
    padding: 100px 100px 10px 100px;

    h1 {
        font-size: 45px;
    }
`

const Subheader = styled.div`
    font-weight: 300;
    font-size: 23px;
`

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
    width: 93%;
    padding: 30px;
`

const Todos = () => {
    const [todos, setTodos] = useState([])
    const [inputTodo, setInputTodo] = useState({title: ''})
    const [loaded, setLoaded] = useState(false)

    // Runs on first render
    useEffect( () => {
        // Loads todos from API into `todos` state var
        axios.get('/api/v1/todos')
        .then( resp => {
            setTodos(resp.data.data)
            setLoaded(true)
        })
        .catch( resp => console.log(resp) )
    }, [])

    // Sort via ascending order (Add a button to swap the order in the future)
    const grid = todos.slice().reverse().map( myTodo => 
         (
            <Todo
                key={myTodo.id} 
                attributes={myTodo.attributes}
            />
        )
    )

    const handleKeypress = (e) => {
        if (e.key === 'Enter') {
            const csrfToken = document.querySelector('[name=csrf-token]').content
            axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken

            axios.post('/api/v1/todos', inputTodo)
            .then (resp => {
                setTodos(todos.concat([resp.data.data]))
                setInputTodo({title: ''})
            })
            .catch( resp => console.log(resp) )
        }
    }

    const handleChange = (e) => { setInputTodo({title: e.target.value}) }



    return (
        <div>
        { 
            loaded && 
            <Home>
                <Header>
                    <h1>Todo App</h1>
                    <Subheader>Simple todo list.</Subheader>
                </Header>
                <TodoInput 
                    inputTodo = {inputTodo}
                    handleKeypress = {handleKeypress}
                    handleChange = {handleChange}
                    // attributes = {todos.data.attributes}
                />

                <Grid>
                    {grid}
                </Grid>
            </Home>
        }
        </div>
    )
}

export default Todos