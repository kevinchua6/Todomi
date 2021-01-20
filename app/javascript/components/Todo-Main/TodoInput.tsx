import React from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
    padding: 10px;
    padding-bottom: 55px;
`;
const InputTodo = styled.input`
    padding: 10px;
    width: 50%;
    border-radius: 5px;
    box-sizing: border-box;
`;

export interface TodoInput {
    inputTodo: { title: string }
    handleKeypress: (e: React.KeyboardEvent<Element>) => void
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
};

const TodoInput = ({inputTodo, handleKeypress, handleChange}: TodoInput) => {
    return (
        <InputContainer>
            <InputTodo
                type="text"
                value = {inputTodo.title}
                onChange = {handleChange}
                onKeyPress={handleKeypress}
                placeholder="Add a task" 
                maxLength={25}
            />
        </InputContainer>
    );
}

export default TodoInput;
