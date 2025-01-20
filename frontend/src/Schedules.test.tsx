import { render, screen, waitFor } from '@testing-library/react'
import { Schedules, ScheduleItem } from './Schedules'
import { fetchAccountSchedules } from './services/accounts'
import type { Schedule } from './types/account'

jest.mock('./services/accounts')
const mockFetchAccountSchedules = fetchAccountSchedules as jest.MockedFunction<typeof fetchAccountSchedules>

const mockSchedules: Schedule[] = [
  {
    toBank: 'KTB',
    toAccount: '222-222-222',
    toAccountName: 'MaiThai',
    amount: -1899900,
    date: '2025-07-01 12:00:00',
  },
  {
    toBank: 'SCB',
    toAccount: '333-333-333',
    toAccountName: 'LaumPlearn',
    amount: -2499850,
    date: '2025-08-01 12:00:00',
  },
  {
    toBank: 'KBank',
    toAccount: '444-444-444',
    toAccountName: 'Laumcing',
    amount: -2398825,
    date: '2025-09-01 12:00:00',
  },
]

describe('ScheduleItem', () => {
  it('renders negative amount correctly', () => {
    render(
      <ScheduleItem
        toBank="SCB"
        toAccount="111-111-111-111"
        toAccountName="AnuchitO"
        date="2025-01-15"
        amount={- 100000}
      />
    )

    expect(screen.getByText('AnuchitO')).toBeInTheDocument()
    expect(screen.getByText('SCB 111-111-111-111')).toBeInTheDocument()
    expect(screen.getByText('15 Jan 2025')).toBeInTheDocument()
    expect(screen.getByText('-1,000.00')).toBeInTheDocument()
    expect(screen.getByText('-1,000.00')).toHaveClass('text-red-400') // Check red color for negative amount
  })

})

describe('Schedules', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    mockFetchAccountSchedules.mockImplementation(() => new Promise(() => { }))

    render(<Schedules accountNumber="111-111-111" />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders error state if fetch fails', async () => {
    mockFetchAccountSchedules.mockRejectedValueOnce(new Error('Failed to load schedules'))

    render(<Schedules accountNumber="111-111-111" />)

    await waitFor(() => {
      expect(screen.getByText('Failed to load account schedules')).toBeInTheDocument()
    })
  })

  it('renders schedules successfully when fetch is successful', async () => {
    mockFetchAccountSchedules.mockResolvedValueOnce(mockSchedules)

    render(<Schedules accountNumber="111-111-111" />)

    await waitFor(() => {
      expect(screen.getByText('Scheduled Transactions')).toBeInTheDocument()
      expect(screen.getByText('Laumcing')).toBeInTheDocument()
      expect(screen.getByText('KBank 444-444-444')).toBeInTheDocument()
      expect(screen.getByText('01 Sep 2025')).toBeInTheDocument()
      expect(screen.getByText('-23,988.25')).toBeInTheDocument()

      expect(screen.getByText('LaumPlearn')).toBeInTheDocument()
      expect(screen.getByText('SCB 333-333-333')).toBeInTheDocument()
      expect(screen.getByText('01 Aug 2025')).toBeInTheDocument()
      expect(screen.getByText('-24,998.50')).toBeInTheDocument()
    })
  })

  it('renders with no schedules', async () => {
    mockFetchAccountSchedules.mockResolvedValueOnce([])

    render(<Schedules accountNumber="111-111-111" />)

    await waitFor(() => {
      expect(screen.getByText("End of scheduled transactions")).toBeInTheDocument()
    })
  })

  it('calls fetchAccountSchedules with correct account number', async () => {
    mockFetchAccountSchedules.mockResolvedValueOnce(mockSchedules)

    render(<Schedules accountNumber="222-222-222" />)

    await waitFor(() => {
      expect(mockFetchAccountSchedules).toHaveBeenCalledWith('222-222-222')
    })
  })

  it('uses default account number when none is provided', async () => {
    mockFetchAccountSchedules.mockResolvedValueOnce(mockSchedules)

    render(<Schedules />)

    await waitFor(() => {
      expect(mockFetchAccountSchedules).toHaveBeenCalledWith('111-111-111')
    })
  })

  it('does not render the monthly dropdown when hideMonthly is true', async () => {
    mockFetchAccountSchedules.mockResolvedValueOnce(mockSchedules)

    render(<Schedules accountNumber="111-111-111" />)

    await waitFor(() => {
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    })
  })
})

