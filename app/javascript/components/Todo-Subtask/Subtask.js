import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { useDebounce } from 'use-debounce'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import styled from 'styled-components'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'

const Wrapper = styled.div`
    padding-top: 10px;
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

            // 
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
        <Wrapper>
            <Checkbox 
                style={{
                    "padding-top": 4
                }}
                onChange={handleChangeCheckbox} 
                type="checkbox" 
                checked={subtaskBool}
                color="primary"
            />
            <TextField 
                style={{
                    width: "91%"
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