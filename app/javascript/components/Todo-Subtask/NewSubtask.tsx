import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { useDebounce } from 'use-debounce'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'

export interface NewSubtask {
    inputSubtasks: {
        text: string;
        done: boolean;
        todo_id: string;
    },
    handleNewSubtaskKeypress: (e: React.KeyboardEvent<Element>) => void,
    handleNewSubtaskChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const NewSubtask = (props: NewSubtask) => {
    return (
        <TextField 
            style={{
                width: "100%",
                height: "50%"
            }}
            inputProps={{ maxLength: 25 }}
            variant="outlined"
            value = {props.inputSubtasks.text}
            onKeyPress = {props.handleNewSubtaskKeypress}
            onChange = {props.handleNewSubtaskChange}
            label="Add a subtask"
        />
    )
}

export default NewSubtask
