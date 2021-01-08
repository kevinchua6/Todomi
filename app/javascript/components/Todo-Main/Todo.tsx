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

const Card = styled.div`
    user-select: none;
    display: none;
    position: absolute;
    width: 95px;
    height: 95px;
    line-height: 95px;
    margin: 10px;
    z-index: 1;
    cursor: pointer;
    will-change: transform;
    border-radius: 6px;
    transition: box-shadow 0.2s;
    border-top-right-radius: 20px;
`
const CardContent=styled.div`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    font-size: 24px;
    font-weight: 300;
    background-color: rgba(255, 255, 255, 0.9);
    border: 2px solid;
    color: #333;
    border-radius: 4px;
    -webkit-transition: all 0.2s ease-out;
    -moz-transition: all 0.2s ease-out;
    -ms-transition: all 0.2s ease-out;
    -o-transition: all 0.2s ease-out;
    transition: all 0.2s ease-out;
`

// const Card = styled.div`
//     display: block;
//     position: absolute;
//     height: 500px;
//     width: 200px;
//     margin: 5px;
//     z-index: 1;

//     border: 1px solid #efefef;
//     background: #fff;
//     text-align: center;

//     &:hover {
//         box-shadow: 0 0 11px rgba(33,33,33,.2);
//     }
// `

const TodoTitle = styled.div`
    padding: 20px 0 15px 0;
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
            {/* Todo: Change the color of the box when urgency changes */}
            {/* <div className="todo-urgency">{props.attributes.urgency}</div> */}

            {renderSubtasks}

            <Button
            title="completeSubtaskButton"
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