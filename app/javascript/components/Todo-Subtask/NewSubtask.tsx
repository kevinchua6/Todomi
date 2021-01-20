import React from 'react';
import TextField from '@material-ui/core/TextField';

export interface NewSubtaskI {
    inputSubtasks: {
        text: string
        done: boolean
        todo_id: string
    }
    handleNewSubtaskKeypress: (e: React.KeyboardEvent<Element>) => void
    handleNewSubtaskChange: (e: React.ChangeEvent<HTMLInputElement>) => void
};

const NewSubtask = ({ inputSubtasks, handleNewSubtaskChange, handleNewSubtaskKeypress }: NewSubtaskI) => {
    return (
        <TextField 
            style={{
                width: "100%",
                height: "50%"
            }}
            inputProps={{ maxLength: 25 }}
            variant="outlined"
            value = {inputSubtasks.text}
            onKeyPress = {handleNewSubtaskKeypress}
            onChange = {handleNewSubtaskChange}
            label="Add a subtask"
        />
    );
}

export default NewSubtask;
