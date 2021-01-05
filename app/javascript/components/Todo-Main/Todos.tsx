import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import Todo from './Todo'
import TodoInput from './TodoInput'
import styled from 'styled-components'
import Subtask from '../Todo-Subtask/Subtask'

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
    padding-bottom: 10px;
`
const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 20px;
    width: 93%;
    padding: 30px;
`
export interface Todos {
    id: string,
    type: string,
    attributes: {
        title: string,
        done: boolean,
        urgency: number,
        id: number
    },
    relationships: {
        subtasks: {
            data: {
                id: string,
                type: string
            }[]
        }
    }
}

export interface InputTodo {
    title: string,
    done?: boolean,
    id?: number,
    urgency?: number
}

const Todos = () => {
    const [todos, setTodos] = useState<Todos[]>([])
    const [inputTodo, setInputTodo] = useState<InputTodo>({ title: "" })
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

    // Sort via ascending order (Add a button to swap the order and drag and drop in the future)
    const grid = todos.slice().reverse().map( todo => {
            const todo_id: number = +todo.id
            return (
                <Todo
                    key={todo_id} 
                    attributes={todo.attributes}
                />
            )
        }
    )
    console.log(grid)

    const handleKeypress = (e: React.KeyboardEvent<Element>) => {
        if (e.key === 'Enter') {
            axios.post('/api/v1/todos', inputTodo)
            .then (resp => {
                setTodos(todos.concat(resp.data.data))
                setInputTodo({title: ''})
            })
            .catch( resp => console.log(resp) )
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setInputTodo({title: e.target.value}) }

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