import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import Subtask from '../Todo-Subtask/Subtask'
import axios from 'axios'
import { Subtasks } from '../Todo-Subtask/Todo'
import Checkbox from '@material-ui/core/Checkbox'
import TodoSubtask from './TodoSubtask'

const Card = styled.div`
    transition: box-shadow .3s;
    border: 1px solid #efefef;
    background: #fff;
    text-align: center;
    position: relative;

    &:hover {
        box-shadow: 0 0 11px rgba(33,33,33,.2);
    }
`

const TodoTitle = styled.div`
    padding: 20px 0 15px 0;
    font-size: 22px;
`

const LinkWrapper = styled.div`
    margin: 30px 0 20px 0;
    height: 50px;
    
    a {
        color: #fff;
        background: #000;
        border-radius: 4px;
        padding: 10px 40px;
        border: 10px 50px;
        width: 70%;
        text-decoration: none;
    }
`
const Ellipsis = styled.div`
    text-align: left;
    margin-left: 50px;
    margin-top: 6px;
`

// TODO: Change the link wrapper to the entire card and the View Task button to be delete instead

export interface Todo {
    attributes: {
        title: string,
        done: boolean,
        urgency: number,
        id: number
    }
}

const Todo = (props: Todo) => {
    const todo_id: string = "" + props.attributes.id

    const [subtasks, setSubtasks] = useState<Subtasks[]>([])
    const [renderSubtasks, setRenderSubtasks] = useState<JSX.Element[]>([])

    useEffect( () => {
        // Get Subtasks for each Todo
        
        const url = `/api/v1/todos/${todo_id}`

        axios.get(url)
        .then( 
            resp => { 
                setSubtasks(resp.data.included)
                // subtasks are an object with {1:{id:1,attributes..}, 2:{}}
            }
        )
        .catch( resp => console.log(resp) )
    
    }, [])

    const updateSubtask = (id: string, done: boolean) => {
        setSubtasks(subtasks.map( subtask => 
            subtask.id === id
                ? {...subtask, attributes: {...subtask.attributes, done: !done} }
                : subtask
            )
        )
    }

    useEffect( ()=> {
        const undoneSubtasks: Subtasks[] = subtasks.filter(subtask => !subtask.attributes.done).sort( (a, b) => (a.id > b.id ? 1 : -1))
        const doneSubtasks: Subtasks[] = subtasks.filter(subtask => subtask.attributes.done).sort( (a, b) => (a.id > b.id ? 1 : -1))

        const maxNoSubtask = 6
        setRenderSubtasks([...undoneSubtasks, ...doneSubtasks].map( (subtask, index) => 
            index < maxNoSubtask
            ? (
                <TodoSubtask
                    key={subtask.id}
                    id={subtask.id}
                    todo_id={+todo_id}
                    updateSubtask={updateSubtask}
                    attributes={subtask.attributes}
                />
            )
            : index == maxNoSubtask
            ? ( <Ellipsis> ... </Ellipsis> )
            : ( <div></div> )
            
        )
    )}, [subtasks])

    return (
        <Card>
            <TodoTitle>{props.attributes.title}</TodoTitle>
            {/* <div className="todo-urgency">{props.attributes.urgency}</div> */}

            {renderSubtasks}

            <Button
                style={{
                    margin: 15,
                    // position: "absolute",
                    // bottom: 0,
                    // textAlign: "center",
                    // left: 40

                }}
                variant="contained"
                href= {`/todos/${props.attributes.id}`}>
                View Task
            </Button>
        </Card>
    )
}

export default Todo