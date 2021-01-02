import React, { useState, useEffect, Fragment } from 'react'
import { useDebounce } from 'use-debounce'
import axios from 'axios'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import styled from 'styled-components'
import Subtask from './Subtask'
import NewSubtask from './NewSubtask'
import TextField from '@material-ui/core/TextField'

const Card = styled.div `
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 4px;
    padding: 20px;
    margin: 0 20px 20px 0;
`
const Description = styled.div `
    padding: 0 0 20px 0;
    font-size: 14px;
`
const Wrapper = styled.div`
    padding-top: 110px;
    height: 100vh;
    width: 55%;
    margin: auto;
`

const Title = styled.div`
    padding-left: 5px;
    padding-bottom: 40px;
    font-size: 50px;
    font-weight: bold;
`

const Todo = (props) => {
    const {todo_id} = props.match.params
    const [todo, setTodo] = useState({})
    const [debouncedTodo] = useDebounce(todo, 1000)
    const [subtasks, setSubtasks] = useState([])
    // const [rerenderSubtasks, setRerenderSubtasks] = useState(false)
    const [subtaskId, setSubtaskId] = useState()
    const [subtaskDone, setSubtaskDone] = useState()
    const [loaded, setLoaded] = useState(false)

    const [inputSubtasks, setInputSubtasks] = useState({text: '', done: false, todo_id: todo_id})

    const csrfToken = document.querySelector('[name=csrf-token]').content
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken

    useEffect( () => {
        const url = `/api/v1/todos/${todo_id}`
        
        axios.get(url)
        .then( 
            resp => { 
                setTodo(resp.data.data.attributes) 
                // todo has {done:false, id: 1, title: "buy milk", urgency:3}
                setSubtasks(resp.data.included)
                // subtasks are an array of objects with [{id:"1", type:"subtask", attributes:{}}]
                setLoaded(true)
            }
        )
        .catch( resp => console.log(resp) )
    }, [])

    const handleChangeTodo = (e) => { setTodo({title: e.target.value}) }

    useEffect( () => {
        if (loaded) {
            const url = `/api/v1/todos/${todo_id}`
            
            axios.patch(url, {title: todo.title})
            .then( 
                resp => { 
                    console.log(resp)
                }
            )
            .catch( resp => console.log(resp) )
        }
    // https://stackoverflow.com/a/58021695, yarn add use-debounce
    }, [debouncedTodo])

    const handleNewSubtaskKeypress = (e) => {
        console.log(inputSubtasks)
        if (e.key === 'Enter') {
            axios.post('/api/v1/subtasks', inputSubtasks)
            .then (resp => {
                setSubtasks(subtasks.concat([resp.data.data]))
                setInputSubtasks({...inputSubtasks, text: '', done: false})
            })
            .catch( resp => console.log(resp) )
        }
    }

    const handleNewSubtaskChange = (e) => { setInputSubtasks({...inputSubtasks, text: e.target.value}) }
    
    const getSubtask = (id, done) => {
        setSubtaskId(id)
        setSubtaskDone(done)
        subtasks.map( subtask => {
            if (subtask.id == id) {
                subtask.attributes.done = !subtask.attributes.done
                // console.log(subtask)
                // console.log(subtask.attributes.done)
                return
            }
        })
    }

    let renderSubtasks


    if (loaded && subtasks) {
        const undoneSubtasks = subtasks.filter(subtask => !subtask.attributes.done).sort( (a, b) => (a.id > b.id ? 1 : -1))
        const doneSubtasks = subtasks.filter(subtask => subtask.attributes.done).sort( (a, b) => (a.id > b.id ? 1 : -1))

        renderSubtasks = [...undoneSubtasks, ...doneSubtasks].map( subtask => {
                return (
                    <Subtask
                        getSubtask={getSubtask}
                        todo_id={todo.id}
                        id={subtask.id}
                        key={subtask.id}
                        attributes={subtask.attributes}
                        loaded={loaded}
                    />
                )
        })
    }

    return (
        <div>
        {
            loaded && 
            <Wrapper>
                <Title> Edit Task </Title>
                    <TextField 
                        style= {{
                            width: "100%",
                            margin: 5,
                            marginBottom: 25
                        }}
                        variant="outlined"
                        onChange={handleChangeTodo} 
                        value={todo.title} 
                        type="text" 
                        name="title" 
                        label="Task"
                    />
                    <br/>
                        {renderSubtasks}
                    <br/>
                    <NewSubtask
                        inputSubtasks={inputSubtasks}
                        handleNewSubtaskKeypress={handleNewSubtaskKeypress}
                        handleNewSubtaskChange={handleNewSubtaskChange}
                    />


            </Wrapper>
        }
        </div>
    )
}

export default Todo