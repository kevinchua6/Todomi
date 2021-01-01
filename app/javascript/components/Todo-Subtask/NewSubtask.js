import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { useDebounce } from 'use-debounce'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import styled from 'styled-components'

const NewSubtask = (props) => {
    return (
        <div>
            <input 
                value = {props.inputSubtasks.text}
                onKeyPress = {props.handleNewSubtaskKeypress}
                onChange = {props.handleNewSubtaskChange}
                placeholder="Add a subtask" maxLength="50"
            />
        </div>
    )
}

export default NewSubtask
