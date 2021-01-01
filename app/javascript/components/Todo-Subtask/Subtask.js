import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { useDebounce } from 'use-debounce'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import styled from 'styled-components'

const Field = styled.div`
    border-radius: 4px;

    input {
        min-height: 50px;
        border-radius: 4px;
        border: 1px solid #e6e6e6;
        margin: 0 0 12px 0;
        padding: 12px;
        width: 94%;
    }

    textarea {
        width: 100%;
        min-height: 80px;
        border-radius: 4px;
        border: 1px solid #e6e6e6;
        margin: 12px 0;
        padding: 12px;
    }
`

const Subtask = (props) => {
    const {text, done} = props.attributes

    const [subtasktxt, setSubtasktxt] = useState(text)
    const [debouncedSubtasktxt] = useDebounce(subtasktxt, 1000)

    const [subtaskBool, setSubtaskBool] = useState(done)

    

    const csrfToken = document.querySelector('[name=csrf-token]').content
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken

    const handleChangeCheckbox = () => { setSubtaskBool(!subtaskBool) }

    useEffect( () => {
        if (props.loaded) {
            const url = `/api/v1/subtasks/${props.id}`

            axios.patch(url, {done: subtaskBool})
            .then( resp =>  console.log(resp) )
            .catch( resp => console.log(resp) )
        }
    }, [subtaskBool])

    // TODO: when subtask is checked, put a strikethrough, make it transparent
    // and put it to the bottom.
    const handleChangeSubtask = (e) => { setSubtasktxt(e.target.value) }
    
    useEffect( () => {
        if (props.loaded) {
            const url = `/api/v1/subtasks/${props.id}`
            
            axios.patch(url, {text: subtasktxt})
            .then( resp =>  console.log(resp) )
            .catch( resp => console.log(resp) )
        }
    }, [debouncedSubtasktxt])

    return (
        <Field>
            <input 
                onChange={handleChangeCheckbox} 
                type="checkbox" 
                checked={subtaskBool}
            />
            <input 
                onChange={handleChangeSubtask} 
                value={subtasktxt} 
                type="text" 
                name="title" 
            />
        </Field>
    )
}

export default Subtask