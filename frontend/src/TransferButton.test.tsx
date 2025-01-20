import { render, screen, fireEvent } from '@testing-library/react';
import { TransferButton } from './TransferButton';
import '@testing-library/jest-dom';


// Tests for TransferButton component
describe('TransferButton', () => {
  it('renders the TransferButton with default props', () => {
    render(<TransferButton label="Transfer" onClick={jest.fn()} />);

    // Check if the button has the default label "Transfer"
    expect(screen.getByText('Transfer')).toBeInTheDocument();

    // Check if the button has the correct style (background color)
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('background: linear-gradient(45deg, #1E40AF 30%, #0EA5E9 90%)');

    // Check if the button contains the transfer icon
    const icon = screen.getByAltText('transfer');
    expect(icon).toHaveClass('w-6 h-6');
  });

  it('renders the TransferButton with a custom label', () => {
    render(<TransferButton onClick={jest.fn()} label="Send Money" />);

    // Check if the button contains the custom label
    expect(screen.getByText('Send Money')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<TransferButton label="Transfer" onClick={handleClick} />);

    // Simulate a click event
    fireEvent.click(screen.getByText('Transfer'));

    // Check if the onClick function is called
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when the button is not clicked', () => {
    const handleClick = jest.fn();
    render(<TransferButton label="Transfer" onClick={handleClick} />);

    // Check that onClick is not called before a click
    expect(handleClick).not.toHaveBeenCalled();
  });
});

