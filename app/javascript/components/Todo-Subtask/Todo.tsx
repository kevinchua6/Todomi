import React, { useState, useEffect, Fragment } from 'react'
import { useDebounce } from 'use-debounce'
import axios from 'axios'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import styled from 'styled-components'
import Subtask from './Subtask'
import NewSubtask from './NewSubtask'
import TextField from '@material-ui/core/TextField'
import { InputTodo } from '../Todo-Main/Todos'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Navbar from '../Shared/Navbar'
import clsx from 'clsx';
import { makeStyles, Theme, createStyles } from '@material-ui/core'

const Wrapper = styled.div`
    padding-top: 110px;
    width: 55%;
    margin: auto;
`
const Title = styled.div`
    padding-left: 5px;
    padding-bottom: 40px;
    font-size: 50px;
    font-weight: bold;
`

export interface TodoSubtaskProps {
    match: {
        params: {
            todo_id: string
        }
    },
    handleDrawerOpen: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    open: boolean,
    handleDrawerClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    setSearchInput: React.Dispatch<React.SetStateAction<string>>,
    searchInput: string
}

export interface Subtasks {
    id: string,
    attributes: {
        text: string,
        done: boolean,
        todo_id: number
    }    
}

const drawerWidth = 240
const padding = 120

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth + padding,
            paddingTop: 50
          },
          contentShift: {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: padding,
          },

    }
))

const Todo = (props: TodoSubtaskProps) => {
    const {todo_id} = props.match.params
    
    const [todo, setTodo] = useState<InputTodo>({ title: "" })

    const [debouncedTodo] = useDebounce(todo, 100)
    const [subtasks, setSubtasks] = useState<Subtasks[]>([])
    const [renderSubtasks, setRenderSubtasks] = useState<JSX.Element[]>([])
    const [loaded, setLoaded] = useState(false)

    const [inputSubtasks, setInputSubtasks] = useState({text: '', done: false, todo_id: todo_id})


    const classes = useStyles();

    useEffect( () => {
        // On render gets the todo and subtask info of the specified id
        const url = `/api/v1/todos/${todo_id}`
        axios.get(url).then( 
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

    const handleChangeTodo = (e: React.ChangeEvent<HTMLInputElement>) => { setTodo({...todo, title: e.target.value}) }

    useEffect( () => {
        // Debounced saving of todo title
        if (loaded) {
            const url = `/api/v1/todos/${todo_id}`
            axios.patch(url, {title: todo.title})
            .catch( resp => console.log(resp) )
        }
    }, [debouncedTodo])

    const handleNewSubtaskKeypress = (e: React.KeyboardEvent<Element>) => {
        // Does a post request of a new subtask upon pressing enter
        if (inputSubtasks.text !== "" && e.key === 'Enter') {
            axios.post('/api/v1/subtasks', inputSubtasks).then (resp => {
                setSubtasks(subtasks.concat([resp.data.data]))
                setInputSubtasks({...inputSubtasks, text: '', done: false})
            })
            .catch( resp => console.log(resp) )
        }
    }

    const handleNewSubtaskChange = (e: React.ChangeEvent<HTMLInputElement>) => { setInputSubtasks({...inputSubtasks, text: e.target.value}) }
    
    const updateSubtask = (id: string, done: boolean) => {
        // When checkbox is clicked for a subtask, changes its done property
        setSubtasks(subtasks.map( subtask => 
            subtask.id === id
                ? {...subtask, attributes: {...subtask.attributes, done: !done} }
                : subtask
            )
        )
    }

    useEffect( () => {
        // Arranges subtasks in order when `subtasks` is modified
        const undoneSubtasks: Subtasks[] = subtasks.filter(subtask => !subtask.attributes.done).sort( (a, b) => (+a.id > +b.id ? 1 : -1))
        const doneSubtasks: Subtasks[] = subtasks.filter(subtask => subtask.attributes.done).sort( (a, b) => (+a.id > +b.id ? 1 : -1))
        console.log(undoneSubtasks)

        setRenderSubtasks([...undoneSubtasks, ...doneSubtasks].map( subtask => {
                return (
                    <Subtask
                        key={subtask.id}
                        id={subtask.id}
                        todo_id={todo.id}
                        updateSubtask={updateSubtask}
                        attributes={subtask.attributes}
                        loaded={loaded}
                    />
                )
            })
        )
    }, [loaded, subtasks])

    return (
        <div>
            <Navbar                
            open={props.open}
            handleDrawerOpen={props.handleDrawerOpen}
            handleDrawerClose={props.handleDrawerClose}
            setSearchInput={props.setSearchInput}
            searchInput={props.searchInput}  
            />
            <Wrapper>
                <div
                className={clsx(classes.content, {
                    [classes.contentShift]: props.open,
                })}>
                    <Link to="/">
                        <ArrowBackIcon
                        style={{
                            fontSize: 48,
                            paddingBottom: 25,
                            color: "black"
                        }} />
                    </Link>
                    <Title> Edit Task </Title>
                        <TextField 
                            style= {{
                                width: "100%",
                                margin: 5,
                                marginBottom: 25
                            }}
                            inputProps={{ maxLength: 25 }}
                            variant="outlined"
                            onChange={handleChangeTodo} 
                            value={todo.title} 
                            type="text" 
                            name="title" 
                            label="Task"
                        />
                        <br/>
                        {
                            loaded && renderSubtasks
                        }
                        <br/>
                        <NewSubtask
                            inputSubtasks={inputSubtasks}
                            handleNewSubtaskKeypress={handleNewSubtaskKeypress}
                            handleNewSubtaskChange={handleNewSubtaskChange}
                        />
                </div>
            </Wrapper>
        </div>
    )
}

export default Todo
