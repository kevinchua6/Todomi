import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { useDebounce } from 'use-debounce'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'

const Wrapper = styled.div`
    padding-top: 10px;
`

export interface Subtask {
    id: string,
    todo_id: number | undefined,
    updateSubtask: (id: string, done: boolean) => void,
    attributes: {
        text: string,
        done: boolean,
        todo_id: number
    }
    loaded: boolean
}

const Subtask = (props: Subtask) => {
    const {text, done, todo_id} = props.attributes

    const [subtasktxt, setSubtasktxt] = useState(text)
    const [debouncedSubtasktxt] = useDebounce(subtasktxt, 100)

    const [subtaskBool, setSubtaskBool] = useState(done)

    const handleChangeCheckbox = () => { 
        setSubtaskBool(!subtaskBool)
        props.updateSubtask(props.id, done)
    }

    useEffect( () => {
        if (props.loaded) {
            const url = `/api/v1/subtasks/${props.id}`

            axios.patch(url, {done: subtaskBool})
            .then( resp =>  console.log(resp) )
            .catch( resp => console.log(resp) )
        }
    }, [subtaskBool])

    const handleChangeSubtask = (e: React.ChangeEvent<HTMLInputElement>) => { setSubtasktxt(e.target.value) }
    
    useEffect( () => {
        if (props.loaded) {
            const url = `/api/v1/subtasks/${props.id}`
            
            axios.patch(url, {text: subtasktxt})
            .then( resp =>  console.log(resp) )
            .catch( resp => console.log(resp) )
        }
    }, [debouncedSubtasktxt])

    

    return (
        <Wrapper>
            <Checkbox 
                style={{
                    paddingTop: 4
                }}
                onChange={handleChangeCheckbox} 
                checked={subtaskBool}
                color="primary"
            />
            <TextField 
                inputProps={{
                    maxLength: 25,
                    style: {
                        textDecoration: subtaskBool ? "line-through" : "",
                        opacity: subtaskBool ? 0.5 : 1
                    }
                }}
                style={{
                    width: "91%",
                }}
                onChange={handleChangeSubtask} 
                value={subtasktxt} 
                type="text" 
                name="title" 
            />
        </Wrapper>
    )
}

export default Subtask
