import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import Todo from './Todo'
import TodoInput from './TodoInput'
import styled from 'styled-components'
import { Subtasks } from '../Todo-Subtask/Todo'
import debounce from '../../utils/debounce'
import { Responsive, WidthProvider } from "react-grid-layout"
import Button from '@material-ui/core/Button'
import Navbar from '../Shared/Navbar'
import './grid-styles.css'
import clsx from 'clsx';

const ResponsiveGridLayout = WidthProvider(Responsive);

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

export interface Todos {
    id: string,
    type: string,
    attributes: {
        title: string,
        done: boolean,
        urgency: number,
        id: number,
        tag: string,
        order: number,
        user_id: number
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

export interface SubtaskLength {
    length: number
}

export interface UserId {
    user_id: number
}

export interface TodosProp {
    handleDrawerOpen: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    open: boolean,
    handleDrawerClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Todos = (props: TodosProp) => {
    const [todos, setTodos] = useState<Todos[]>([])
    const [subtaskLength, setSubtaskLength] = useState<SubtaskLength[]>([])
    const [inputTodo, setInputTodo] = useState<InputTodo>({ title: "" })
    const [loaded, setLoaded] = useState(false)

    // Runs on first render
    useEffect( () => {
        // Gets user_id of the current session
        axios.get('/user_id')
        .then( (resp) => {
            const user_id: number = resp.data.user_id
            // Loads todos from API into `todos` state var
            axios.get('/api/v1/todos')
            .then( resp => {
                setTodos(resp.data.data.filter( (todo: Todos) => todo.attributes.user_id === user_id) )
                setLoaded(true)
            })
            .catch( resp => console.log(resp) )
        })
        .catch( resp => console.log(resp) )
    }, [] )

    const handleDeleteTodo = (todo_id: string, subtasks: Subtasks[]) => {
        const deleteTask = () => {
            const url = `/api/v1/todos/${todo_id}`

            axios.delete(url)
            .then( resp => 
                setTodos( todos.filter( todo => 
                    todo.id != todo_id
                ))
             )
            .catch( resp => console.log(resp) )
        }

        const debouncedDelete = debounce(deleteTask, 200)

        if (subtasks.length !== 0) {
            subtasks.forEach( subtask => {
                const url = `/api/v1/subtasks/${subtask.id}`
                axios.delete(url)
                .then( resp => {
                    debouncedDelete()
                } )
                .catch( resp => console.log(resp) )
            })
        } else {
            deleteTask()
        }
    }

    // Sort via ascending order (Add a button to swap the order and drag and drop in the future)
    const grid = todos.slice()
        .sort( (a, b) => (a.attributes.id > b.attributes.id ? 1 : -1))
        .map( (todo, index) => {
            const subtaskNo = todo.relationships.subtasks.data.length
            // const height = subtaskNo >= 5 ? 3 : 1
            let height: number
            switch (subtaskNo) {
                case 0:
                    height = 1
                    break
                case 1:
                case 2:
                case 3:
                    height = 2
                    break
                case 4:
                default:
                    height = 3
                    break
            }

            const todo_id: number = +todo.id

            const columnNo = 5
            const x = index % columnNo
            const y = Math.floor(index/columnNo)
            return (
                <div key={todo_id} 
                style={{
                    backgroundColor: "#91c5ff" }}
                data-grid={{x: x, y: y, w: 1, h: height}} >
                <Todo
                    attributes={todo.attributes}
                    handleDeleteTodo={handleDeleteTodo}
                />
                </div>
            )
        }
    )

    const handleKeypress = (e: React.KeyboardEvent<Element>) => {
        if (inputTodo.title !== "" && e.key === 'Enter') {
            axios.post('/api/v1/todos', inputTodo)
            .then (resp => {
                setTodos(todos.concat(resp.data.data))
                setInputTodo({title: ''})
            })
            .catch( resp => console.log(resp) )
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setInputTodo({title: e.target.value}) }
    
    const csrfToken = document.querySelector('[name=csrf-token]').getAttribute('content')
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
    


    return (
        <div>
        { 
            loaded && 
            <div>
                <Navbar
                open={props.open}
                handleDrawerOpen={props.handleDrawerOpen}
                handleDrawerClose={props.handleDrawerClose}/>

                <Home>
                    
                    <Header>
                        <h1>Todo App</h1>
                        <Subheader>Simple todo list.</Subheader>
                    </Header>
                    <TodoInput
                        inputTodo = {inputTodo}
                        handleKeypress = {handleKeypress}
                        handleChange = {handleChange}
                    />
                    <ResponsiveGridLayout
                    breakpoints={{lg: 1600, md: 996, sm: 768, xs: 480, xxs: 0}}
                    cols={{lg: 5, md: 5, sm: 5, xs: 4, xxs: 2}}
                    >
                        {grid}
                    </ResponsiveGridLayout>
                </Home>
            </div>
        }
        </div>
    )
}

export default Todos