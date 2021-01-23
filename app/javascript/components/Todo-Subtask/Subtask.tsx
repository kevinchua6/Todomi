import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDebounce } from 'use-debounce';
import styled from 'styled-components';
import { TextField, IconButton, Checkbox } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

const Wrapper = styled.div`
    padding: 5px 10px 5px 0;
    border-radius: 2px;
`;

const DeleteIcon = styled(IconButton)`
    margin: -10px 0 0 -45px;
`

export interface SubtaskI {
    id: string
    todo_id: number | undefined
    updateSubtask: (id: string, done: boolean) => void
    attributes: {
        text: string
        done: boolean
        todo_id: number
    }
    loaded: boolean
    handleDelete: (id: string) => void
};

const Subtask = ({ id, todo_id, updateSubtask, attributes, loaded, handleDelete }: SubtaskI) => {
    const { text, done } = attributes;
    const [subtasktxt, setSubtasktxt] = useState(text);
    const [debouncedSubtasktxt] = useDebounce(subtasktxt, 100);
    const [subtaskBool, setSubtaskBool] = useState(done);
    const [isMouseOver, setIsMouseOver] = useState(false);

    const handleChangeCheckbox = () => { 
        setIsMouseOver(false);
        setSubtaskBool(!subtaskBool);
        updateSubtask(id, done);
    }

    useEffect( () => {
        if (loaded) {
            const url = `/api/v1/subtasks/${id}`;
            axios.patch(url, {done: subtaskBool})
                .catch( resp => console.log(resp) );
        }
    }, [subtaskBool] );

    const handleChangeSubtask = (e: React.ChangeEvent<HTMLInputElement>) => { setSubtasktxt(e.target.value) };
    
    useEffect( () => {
        if (loaded) {
            const url = `/api/v1/subtasks/${id}`;
            axios.patch(url, {text: subtasktxt})
                .catch( resp => console.log(resp) );
        }
    }, [debouncedSubtasktxt] );

    return (
        <Wrapper style= {{ backgroundColor: subtaskBool ? "rgb(188, 255, 182)" : "#edf5ff" }}>
            <Checkbox 
                style={{
                    paddingTop: 4
                }}
                onChange={handleChangeCheckbox} 
                checked={subtaskBool}
                color="primary"
                onMouseEnter={()=>setIsMouseOver(true)}
                onMouseLeave={()=>setIsMouseOver(false)}
            />
            <TextField 
                inputProps={{
                    maxLength: 25,
                    style: {
                        textDecoration: subtaskBool ? "line-through" : "",
                        opacity: subtaskBool ? 0.5 : 1
                    }
                }}
                style={{ width: "91%" }}
                onChange={handleChangeSubtask} 
                value={subtasktxt} 
                type="text" 
                name="title" 
                onMouseEnter={()=>setIsMouseOver(true)}
                onMouseLeave={()=>setIsMouseOver(false)}
            />
            {    
                isMouseOver && 
                <DeleteIcon
                    onClick={()=>handleDelete(id)}
                    onMouseEnter={()=>setIsMouseOver(true)}
                    onMouseLeave={()=>setIsMouseOver(false)}
                >
                    <ClearIcon style={{color: "#7d7d7d"}}/>
                </DeleteIcon>
            }
        </Wrapper>
    );
};

export default Subtask;
