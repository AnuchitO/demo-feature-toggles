import { render, fireEvent, screen } from '@testing-library/react';
import { CancelButton } from './CancelButton';

// Mocking the icon to avoid having to deal with actual file imports in tests
jest.mock('./icon-cancel.svg', () => 'icon-cancel-mock');

describe('CancelButton Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders the button with the correct label', () => {
    render(<CancelButton label="Cancel" onClick={mockOnClick} />);

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Cancel');
  });

  it('fires the onClick event when clicked', () => {
    render(<CancelButton label="Cancel" onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('displays the icon correctly', () => {
    render(<CancelButton label="Cancel" onClick={mockOnClick} />);

    const icon = screen.getByAltText('Cancel');

    expect(icon).toBeInTheDocument();
  });
});

