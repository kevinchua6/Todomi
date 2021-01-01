import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { useDebounce } from 'use-debounce'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'

const NewSubtask = (props) => {
    return (
        <TextField 
            style={{
                width: "100%",
                height: "50%"
            }}
            variant="outlined"
            value = {props.inputSubtasks.text}
            onKeyPress = {props.handleNewSubtaskKeypress}
            onChange = {props.handleNewSubtaskChange}
            label="Add a subtask" maxLength="50"
        />
    )
}

export default NewSubtask
