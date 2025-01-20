import React, { useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Field, Label, Select } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

// Types
interface DatePickerProps {
  onChange: (date: string) => void;
  defaultValue?: Dayjs;
  className?: string;
}

interface DaysProps {
  onChange: (day: string) => void;
  defaultValue?: string;
}

// Theme configuration
const theme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
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
});

// Base styles
const baseInputStyles =
  'block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white';

export const SingleDatePicker: React.FC<DatePickerProps> = ({
  onChange,
  defaultValue = dayjs(),
}) => {
  const handleChange = (value: Dayjs | null) => {
    const date = value || defaultValue;
    onChange(date.format('YYYY-MM-DD'));
  };

  useEffect(() => {
    onChange(defaultValue.format('YYYY-MM-DD'));
  }, [defaultValue]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <DatePicker
          className={`mt-3 ${baseInputStyles}`}
          defaultValue={defaultValue}
          format="DD MMM YYYY"
          views={['year', 'month', 'day']}
          onChange={handleChange}
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export const MonthDatePicker: React.FC<DatePickerProps> = ({
  onChange,
  defaultValue = dayjs(),
}) => {
  const handleChange = (value: Dayjs | null) => {
    const date = value || defaultValue;
    onChange(date.format('YYYY-MM'));
  };

  useEffect(() => {
    onChange(defaultValue.format('YYYY-MM'));
  }, [defaultValue]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <DatePicker
          className={`mt-3 ${baseInputStyles}`}
          format="MMM YYYY"
          defaultValue={defaultValue}
          views={['month', 'year']}
          onChange={handleChange}
          data-testid="month-date-picker"
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
};


export const Days: React.FC<DaysProps> = ({
  onChange,
  defaultValue = '1'
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  useEffect(() => {
    onChange(defaultValue);
  }, [defaultValue]);

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  return (
    <div className="w-full max-w-md justify-start">
      <Field className="m-4">
        <Label className="text-sm/6 font-medium text-white flex">Day</Label>
        <div className="relative">
          <Select
            className={clsx(
              'mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              // Make the text of each option black on Windows
              '*:text-black'
            )}
            defaultValue={defaultValue}
            onChange={handleChange}
            data-testid="days-select"
          >
            {days.map(day => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </Select>
          <ChevronDownIcon
            data-testid="chevron-icon"
            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
            aria-hidden="true"
          />
        </div>
      </Field >
    </div >
  );
};
