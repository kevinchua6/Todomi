import React, { useState, useEffect, Fragment } from 'react'
import styled from 'styled-components'

const InputContainer = styled.div`
    padding: 10px;
`

const InputTodo = styled.input`
    padding: 10px;
    width: 50%;
    border-radius: 25px;
    box-sizing: border-box;
`

const TodoInput = (props) => {
    return (
            <InputContainer>
                <InputTodo type="text"
                    value = {props.inputTodo.title}
                    onChange = {props.handleChange}
                    input onKeyPress={props.handleKeypress}
                    placeholder="Add a task" maxLength="50" />
            </InputContainer>
    )
}

export default TodoInput

