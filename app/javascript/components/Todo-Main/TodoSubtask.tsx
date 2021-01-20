import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Checkbox from '@material-ui/core/Checkbox';

const Wrapper = styled.div`
    padding-top: 10px;
    text-align: left;
    border-radius: 7px;
    margin: 3px;
    margin-bottom: 7px;
`;
const SubtaskStyle = styled.div`
    padding: 0 5px 5px 5px;
    display: inline;
    font-size: 20px;
    padding-top: 5px;
`;

export interface TodoSubtaskI {
    id: string
    todo_id: number
    updateSubtask: (id: string, done: boolean) => void
    attributes: {
        text: string
        done: boolean
        todo_id: number
    }
};

const TodoSubtask = ({ id, todo_id, updateSubtask, attributes }: TodoSubtaskI) => {
    const {text, done} = attributes;
    const [subtasktxt, setSubtasktxt] = useState(text);
    const [subtaskBool, setSubtaskBool] = useState(done);

    const handleChangeCheckbox = () => { 
        setSubtaskBool(!subtaskBool)
        updateSubtask(id, done)
    };

    useEffect( () => {
        const url: string = `/api/v1/subtasks/${id}`;
        axios.patch(url, { done: subtaskBool })
            .catch( resp => console.log(resp) );
    }, [subtaskBool] );

    return (
        <Wrapper style={{ backgroundColor: subtaskBool ? "#BCFFB6" : "#cbe4ff" }}>
            <Checkbox 
                name="subtaskCheckbox"
                style={{ paddingTop: 4 }}
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
    );
}

export default TodoSubtask;
