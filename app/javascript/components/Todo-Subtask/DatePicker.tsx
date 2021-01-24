import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import axios from 'axios';


const DatePicker = ({selectedDate, setSelectedDate, todo_id}) => {

    const dateObjToYYYYMMDD = (date: Date) => {
        const mm = date.getMonth() + 1;
        const dd = date.getDate();
        return [date.getFullYear(),
                (mm > 9 ? '' : '0') + mm,
                (dd > 9 ? '' : '0') + dd
            ].join('-');
    };

    const handleDateChange = (date: Date | null) => {
        axios.patch(`/api/v1/todos/${todo_id}`, {date: dateObjToYYYYMMDD(date) })
        setSelectedDate(date);
    };

    console.log(selectedDate)

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Due Date"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            minDate={new Date()}
          />
        </MuiPickersUtilsProvider>
    )


    
}

export default DatePicker;