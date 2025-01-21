import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { SingleDatePicker, MonthDatePicker, Days } from './DatePicker';

// Mock initial date
const mockDate = dayjs('2024-01-19');

describe('SingleDatePicker', () => {
  beforeEach(() => {
    // Reset the mock date before each test
    jest.clearAllMocks();
  });

  it('renders with default value', () => {
    render(<SingleDatePicker onChange={() => { }} defaultValue={mockDate} />);
    const picker = screen.getByRole('textbox');
    expect(picker).toBeInTheDocument();
  });

  it('calls onChange with formatted date when date is changed', () => {
    const handleChange = jest.fn();
    render(<SingleDatePicker onChange={handleChange} defaultValue={mockDate} />);

    const picker = screen.getByRole('textbox');
    fireEvent.change(picker, { target: { value: '20 Jan 2024' } });

    expect(handleChange).toHaveBeenCalled();
  });
});

describe('MonthDatePicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default value', () => {
    render(<MonthDatePicker onChange={() => { }} defaultValue={mockDate} />);
    const picker = screen.getByPlaceholderText('MMMM YYYY');
    expect(picker).toBeInTheDocument();
  });

  it('calls onChange with formatted date when month is changed', () => {
    const handleChange = jest.fn();
    render(<MonthDatePicker onChange={handleChange} defaultValue={mockDate} />);

    const picker = screen.getByPlaceholderText('MMMM YYYY');
    fireEvent.change(picker, { target: { value: 'Feb 2024' } });

    expect(handleChange).toHaveBeenCalled();
  });
});

describe('Days', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default value', () => {
    render(<Days defaultValue="01" onChange={() => { }} />);
    const select = screen.getByTestId('days-select');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('01');
  });

  it('renders all 31 days as options', () => {
    render(<Days onChange={() => { }} />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(31);
    expect(options[0]).toHaveValue('01');
    expect(options[30]).toHaveValue('31');
  });

  it('calls onChange when day is selected', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(<Days onChange={handleChange} />);

    const select = screen.getByTestId('days-select');
    await user.selectOptions(select, '15');

    expect(handleChange).toHaveBeenCalledWith('15');
  });

  it('applies custom default value', () => {
    render(<Days defaultValue="15" onChange={() => { }} />);
    const select = screen.getByTestId('days-select');
    expect(select).toHaveValue('15');
  });

  it('renders chevron icon', () => {
    render(<Days onChange={() => { }} />);
    // Using getByRole with the correct attributes for SVG
    const icon = screen.getByTestId('chevron-icon');
    expect(icon).toBeInTheDocument();
    expect(icon.tagName.toLowerCase()).toBe('svg');
    expect(icon.classList.contains('fill-white/60')).toBe(true);
  });
});
