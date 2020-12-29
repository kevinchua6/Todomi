import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import Todo from './Todo'
import TodoInput from './TodoInput'
import styled from 'styled-components'


//Style
const Home = styled.div`
    text-align: center;
    max-width: 1100px;
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
    width: 100%;
    padding: 30px;
`

const Todos = () => {
    const [todos, setTodos] = useState([])
    const [inputTodo, setInputTodo] = useState({title: ''})
    const [loaded, setLoaded] = useState(false)

    const handleKeypress = (e) => {
        // console.log("e.target.name", e.target.name)
        // console.log("e.target.value", e.target.value)
        if (e.key === 'Enter') {
            const csrfToken = document.querySelector('[name=csrf-token]').content
            axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken

            console.log("todo:", inputTodo)
            
            axios.post('/api/v1/todos', inputTodo)
            .then (resp => {
                // Get the old todos plus the new one that is just gotten back 
                // from the post request so we don't need to request from the server
                // twice
                
                // setTodos({...todos, resp.data})
                setTodos(todos.concat([resp.data.data]))

                setInputTodo({title: ''})
                
            })
            .catch( resp => console.log(resp) )
        }
        // console.log(todos)
        // console.log("todo:", inputTodo)
    }

    const handleChange = (e) => {
        // console.log("e.target.name", e.target.name)
        // console.log("e.target.value", e.target.value)

        setInputTodo(Object.assign({}, inputTodo, {title: e.target.value}))

        console.log("todo:", inputTodo)
    }


    useEffect( () => {
        // Get all todos from api and display them here  
        // Update todos in our state
        // When number of todos changes, update the data accordingly
        console.log("changed")
        axios.get('/api/v1/todos')
        .then( resp => {
            setTodos(resp.data.data)
            setLoaded(true)
            // console.log(resp) 
        })
        .catch( resp => console.log(resp) )
    }, [])

    console.log(todos)
    const grid = todos.map( myTodo => {
        // console.log(myTodo)
        return (
            <Todo
                key={myTodo.id} 
                attributes={myTodo.attributes}
            />
        )
    })

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