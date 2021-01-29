import React from 'react';
import TextField from '@material-ui/core/TextField';

interface NewSubtaskI {
    inputSubtasks: {
        text: string
        done: boolean
        todo_id: string
    }
    handleNewSubtaskKeypress: (e: React.KeyboardEvent<Element>) => void
    handleNewSubtaskChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    isDue: boolean
};

const NewSubtask = ({ inputSubtasks, handleNewSubtaskChange, handleNewSubtaskKeypress, isDue }: NewSubtaskI) => {
    return (
        <TextField 
            style={{
                width: "100%",
                height: "50%",
                marginTop: 15,
                backgroundColor: isDue ? "#ffebeb" :"#edf5ff"
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
