import { useState, useEffect } from 'react'
import "./App.css"
import { TransactionButton } from './TransactionButton'
import { ScheduleButton } from './ScheduleButton'
import { Transactions } from './Transactions'
import { Schedules } from './Schedules'
import { useFeatureToggles } from './FeatureTogglesContext'

const App = () => {

  const { features, loading } = useFeatureToggles()
  const [tab, setTab] = useState('transaction')

  useEffect(() => {
    if (loading) {
      return
    }
    if (features.enableViewTransactionsHistory) {
      setTab('transaction')
    } else {
      setTab('schedule')
    }

  }, [loading])


  const onClickTransaction = () => {
    setTab('transaction')
  }

  const onClickSchedule = () => {
    setTab('schedule')
  }

  return <>
    <div>
      <div className="rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center" >
          <div className="flex flex-row items-center justify-center">
            {features.enableViewTransactionsHistory && <TransactionButton onClick={onClickTransaction} />}
            {features.enableViewScheduledTransactions && <ScheduleButton onClick={onClickSchedule} />}
          </div>
        </div>
        <div className="flex flex-col min-h-80  m-4" >
          {loading && <div className="text-center p-4">Loading...</div>}
          {tab === 'transaction' && features.enableViewTransactionsHistory && <>
            <Transactions />
          </>}
          {tab === 'schedule' && features.enableViewScheduledTransactions && <>
            <Schedules />
          </>}
        </div>
      </div>
    </div >
  </>
}
export default App;
