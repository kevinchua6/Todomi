import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import Checkbox from '@material-ui/core/Checkbox'

const Wrapper = styled.div`
    padding-top: 10px;
    text-align: left;
`
const SubtaskStyle = styled.div`
    padding: 0 5px 5px 5px;
    display: inline;
    font-size: 20px;
    padding-top: 5px;
`
export interface TodoSubtask {
    id: string,
    todo_id: number,
    updateSubtask: (id: string, done: boolean) => void,
    attributes: {
        text: string,
        done: boolean,
        todo_id: number
    }
}



const TodoSubtask = (props: TodoSubtask) => {

    const {text, done} = props.attributes

    const [subtasktxt, setSubtasktxt] = useState(text)
    const [subtaskBool, setSubtaskBool] = useState(done)

    const handleChangeCheckbox = () => { 
        setSubtaskBool(!subtaskBool)
        props.updateSubtask(props.id, done)
    }

    useEffect( () => {
            const url = `/api/v1/subtasks/${props.id}`

            axios.patch(url, {done: subtaskBool})
            .then( resp =>  console.log(resp) )
            .catch( resp => console.log(resp) )

            // 
    }, [subtaskBool])

    return (
        <Wrapper>
            <Checkbox 
                name="subtaskCheckbox"
                style={{
                    paddingTop: 4,
                }}
                onChange={handleChangeCheckbox} 
                checked={subtaskBool}
                color="primary"
            />
            <SubtaskStyle 
                style= {{
                    textDecoration: subtaskBool ? "line-through" : "",
                    opacity: subtaskBool ? 0.5 : 1,
                }}
            >
                {subtasktxt} 
            </SubtaskStyle>
        </Wrapper>
    )
}

export default TodoSubtask
