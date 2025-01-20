import { render, screen, waitFor } from '@testing-library/react';
import { Transactions, TransactionItem } from './Transactions';
import { fetchAccountTransactions } from './services/accounts';

// Mock the service
jest.mock('./services/accounts');
const mockFetchAccountTransactions = fetchAccountTransactions as jest.MockedFunction<typeof fetchAccountTransactions>;

describe('TransactionItem', () => {
  it('renders positive amount correctly', () => {
    render(
      <TransactionItem
        type="Transfer in"
        date="18 Jan 2025 15:03"
        amount={100000}
      />
    );

    expect(screen.getByText('Transfer in')).toBeInTheDocument();
    expect(screen.getByText('18 Jan 2025 15:03')).toBeInTheDocument();
    expect(screen.getByText('+1,000.00')).toBeInTheDocument();
    expect(screen.getByText('+1,000.00')).toHaveClass('text-green-400');
  });

  it('renders negative amount correctly', () => {
    render(
      <TransactionItem
        type="Transfer out"
        date="18 Jan 2025 15:03"
        amount={-100000}
      />
    );

    expect(screen.getByText('Transfer out')).toBeInTheDocument();
    expect(screen.getByText('18 Jan 2025 15:03')).toBeInTheDocument();
    expect(screen.getByText('-1,000.00')).toBeInTheDocument();
    expect(screen.getByText('-1,000.00')).toHaveClass('text-red-400');
  });

  it('renders with default props', () => {
    render(<TransactionItem type="Activity" date="18 Jan 2025 15:03" amount={0} />);

    expect(screen.getByText('Activity')).toBeInTheDocument();
    expect(screen.getByText('18 Jan 2025 15:03')).toBeInTheDocument();
    expect(screen.getByText('+0.00')).toBeInTheDocument();
  });
});

describe('Transactions', () => {
  const mockTransactions = [
    {
      id: '1',
      type: 'Transfer in',
      date: '18 Jan 2025 15:03',
      amount: 100000,
      senderId: '123',
      recipientId: '456',
      status: 'completed'
    },
    {
      id: '2',
      type: 'Transfer out',
      date: '19 Jan 2025 16:04',
      amount: -50000,
      senderId: '456',
      recipientId: '123',
      status: 'completed'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    mockFetchAccountTransactions.mockImplementation(() => new Promise(() => { }));

    render(<Transactions accountNumber="111-111-111" />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    mockFetchAccountTransactions.mockRejectedValue(new Error('Failed to fetch'));

    render(<Transactions accountNumber="111-111-111" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load account data')).toBeInTheDocument();
    });
  });

  it('renders transactions successfully', async () => {
    mockFetchAccountTransactions.mockResolvedValue(mockTransactions);

    render(<Transactions accountNumber="111-111-111" />);

    await waitFor(() => {
      expect(screen.getByText('Transactions')).toBeInTheDocument();
      expect(screen.getByText('Transfer in')).toBeInTheDocument();
      expect(screen.getByText('Transfer out')).toBeInTheDocument();
      expect(screen.getByText('+1,000.00')).toBeInTheDocument();
      expect(screen.getByText('-500.00')).toBeInTheDocument();
    });
  });

  it('renders with no transactions', async () => {
    mockFetchAccountTransactions.mockResolvedValue([]);

    render(<Transactions accountNumber="111-111-111" />);

    await waitFor(() => {
      expect(screen.getByText("End of this month's transactions")).toBeInTheDocument();
    });
  });

  it('renders without monthly dropdown when hideMonthly is true', async () => {
    mockFetchAccountTransactions.mockResolvedValue(mockTransactions);

    render(<Transactions accountNumber="111-111-111" />);

    await waitFor(() => {
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });
  });

  it('calls fetchAccountTransactions with correct account number', async () => {
    mockFetchAccountTransactions.mockResolvedValue(mockTransactions);

    render(<Transactions accountNumber="222-222-222" />);

    await waitFor(() => {
      expect(mockFetchAccountTransactions).toHaveBeenCalledWith('222-222-222');
    });
  });

  it('uses default account number when none provided', async () => {
    mockFetchAccountTransactions.mockResolvedValue(mockTransactions);

    render(<Transactions />);

    await waitFor(() => {
      expect(mockFetchAccountTransactions).toHaveBeenCalledWith('111-111-111');
    });
  });
});

