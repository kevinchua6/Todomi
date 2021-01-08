import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import Subtask from '../Todo-Subtask/Subtask'
import axios from 'axios'
import { Subtasks } from '../Todo-Subtask/Todo'
import Checkbox from '@material-ui/core/Checkbox'
import TodoSubtask from './TodoSubtask'
import DoneIcon from '@material-ui/icons/Done'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';

const TodoTitle = styled.div`
    padding: 15px 0 15px 0;
    font-size: 22px;
`
const Ellipsis = styled.div`
    text-align: left;
    margin-left: 50px;
    margin-top: 6px;
`
const ButtonPlaceholder = styled.div`
    width: 110px;
    height: 60px;
    margin: 15px;
    margin-left: auto;
    margin-right: auto;
`

export interface Todo {
    attributes: {
        title: string,
        done: boolean,
        urgency: number,
        id: number
    },
    handleDeleteTodo: (todo_id: string, subtasks: Subtasks[]) => void 
}

const Todo = (props: Todo) => {
    const todo_id: string = "" + props.attributes.id

    const [subtasks, setSubtasks] = useState<Subtasks[]>([])
    const [renderSubtasks, setRenderSubtasks] = useState<JSX.Element[]>([])

    const [buttonCompleted, setButtonCompleted] = useState(false)

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

    // 
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        // if (!e.target.previousSibling && e.target.name !== "subtaskCheckbox" ) {
        //     window.location.href = `/todos/${props.attributes.id}`
        // } else if (e.target.previousSibling && e.target.previousSibling.title !== "completeSubtaskButton") {
        //     window.location.href = `/todos/${props.attributes.id}`
        // }
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
            ? ( <Ellipsis key={subtask.id}> ... </Ellipsis> )
            : ( <div key={subtask.id}></div> )
        ))

        // If all the subtasks are done
        if (undoneSubtasks.length === 0) {
            setButtonCompleted(true)
        } else {
            setButtonCompleted(false)
        }

    }, [subtasks])

    return (
        <div>
            <TodoTitle>{props.attributes.title}</TodoTitle>
            {/* Todo: Allow the color of the box to be changed */}

            {renderSubtasks}
            <Button
            href={`/todos/${props.attributes.id}`}
            startIcon={<FormatListNumberedIcon/>}
            style={{
                backgroundColor: "rgb(204, 209, 255)",
                margin: 15,
                marginLeft: "auto",
                marginRight: "auto",
                position: "absolute",
                bottom: 50,
                textAlign: "center",
                left: 0,
                right: 0,
                width: "95%",
                fontWeight: "bold"
            }}
            variant="contained">
                View Task
            </Button>

            <Button
            startIcon={<DoneIcon/>}
            style={{
                backgroundColor: buttonCompleted ? "rgb(186, 255, 187)" : "",
                margin: 15,
                marginLeft: "auto",
                marginRight: "auto",
                position: "absolute",
                bottom: 0,
                textAlign: "center",
                left: 0,
                right: 0,
                width: "95%",
                fontWeight: "bold"
            }}
            disabled={!buttonCompleted}
            variant="contained"
            onClick= {() => props.handleDeleteTodo(todo_id, subtasks)}>
                Complete Task
            </Button>
            <ButtonPlaceholder/>
        </div>
    )
}

export default Todo