import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Field, Label, Select } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx';

// https://mui.com/x/react-date-pickers/base-concepts/#find-your-component

const theme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '8px',  // Equivalent to 'rounded-lg'
          color: 'white',
        },
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fill: 'white',
        }
      }
    },
  }
})

export function SingleDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <DatePicker
          className={clsx(
            'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
          )}
          defaultValue={dayjs()}
          format="DD MMM YYYY"
          views={['year', 'month', 'day']}
          onChange={(date) => console.log(date?.format('YYYY-MM-DD'))}
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export function MonthDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <DatePicker
          className={clsx(
            'mt-3 block w-full rounded-lg border-none bg-white/5 text-sm/6 text-white',
          )}
          format="MMM YYYY"
          defaultValue={dayjs()}
          views={['month', 'year']}
          onChange={(date) => console.log(date?.format('YYYY-MM-DD'))}
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
}


export function Days() {
  return (
    <div className="w-full max-w-md px-4 justify-start">
      <Field>
        <Label className="text-sm/6 font-medium text-white flex">Day</Label>
        <div className="relative">
          <Select
            className={clsx(
              'mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              '*:text-black'
            )}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
            <option value="25">25</option>
            <option value="26">26</option>
            <option value="27">27</option>
            <option value="28">28</option>
            <option value="29">29</option>
            <option value="30">30</option>
            <option value="31">31</option>
          </Select>
          <ChevronDownIcon
            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
            aria-hidden="true"
          />
        </div>
      </Field>
    </div>
  )
}
