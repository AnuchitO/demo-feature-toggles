import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionButton } from './TransactionButton';
import '@testing-library/jest-dom';  // For the matchers like `toBeInTheDocument`

describe('TransactionButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    // Clear mock function calls before each test to ensure clean slate
    mockOnClick.mockClear();
  });

  test('calls onClick handler when clicked', () => {
    render(<TransactionButton onClick={mockOnClick} />);

    // Simulate button click
    fireEvent.click(screen.getByText('Transactions'));

    // Ensure the onClick function was called once
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});

