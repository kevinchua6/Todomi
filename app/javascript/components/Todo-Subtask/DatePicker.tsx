import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import axios from 'axios';

interface DatePickerI {
  todo_id: string
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>
  selectedDate: Date
}

const DatePicker = ({selectedDate, setSelectedDate, todo_id}: DatePickerI) => {

    const dateObjToYYYYMMDD = (date: Date) => {
        const mm = date.getMonth() + 1;
        const dd = date.getDate();
        return [date.getFullYear(),
                (mm > 9 ? '' : '0') + mm,
                (dd > 9 ? '' : '0') + dd
            ].join('-');
    };

    const handleDateChange = (date: Date | null) => {
        axios.patch(`/api/v1/todos/${todo_id}`, {date: dateObjToYYYYMMDD(date) });
        setSelectedDate(date);
    };

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
            minDateMessage={"Your Task is due!!!"}
          />
        </MuiPickersUtilsProvider>
    );
}

export default DatePicker;