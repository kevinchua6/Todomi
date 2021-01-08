import React, { useState, useEffect, Fragment } from 'react'
import styled from 'styled-components'

const InputContainer = styled.div`
    padding: 10px;
    padding-bottom: 55px;
`

const InputTodo = styled.input`
    padding: 10px;
    width: 50%;
    border-radius: 25px;
    box-sizing: border-box;
`

export interface TodoInput {
    inputTodo: {
        title: string
    },
    handleKeypress: (e: React.KeyboardEvent<Element>) => void,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const TodoInput = (props: TodoInput) => {
    return (
            <InputContainer>
                <InputTodo type="text"
                    value = {props.inputTodo.title}
                    onChange = {props.handleChange}
                    onKeyPress={props.handleKeypress}
                    placeholder="Add a task" 
                    maxLength={25} />
            </InputContainer>
    )
}

export default TodoInput

