import { useState } from 'react'
import "./App.css"
import { TransferButton } from './TransferButton'
import { ScheduleButton } from './ScheduleButton'
import { Accounts } from './Accounts'
import { Transfers } from './Transfers'
import { Schedules } from './Schedules'

const App = () => {
  const [tab, setTab] = useState('transfer')

  const onClickTransfer = () => {
    setTab('transfer')
  }

  const onClickSchedule = () => {
    setTab('schedule')
  }

  return <>
    <div>
      <div className="rounded-2xl overflow-hidden shadow-lg">
        {/* <div className="flex justify-center bg-gradient-to-r from-green-300 via-blue-500 to-purple-600" > */}
        <div className="flex flex-col justify-center" >
          <div>
            <Accounts />
          </div>
          <div>
            <TransferButton onClick={onClickTransfer} />
            <ScheduleButton onClick={onClickSchedule} />
          </div>
        </div>
        <div className="flex flex-col min-h-80  m-4" >
          {tab === 'transfer' && <>
            <Transfers />
          </>}
          {tab === 'schedule' && <>
            <Schedules />
          </>}
        </div>
      </div>
    </div >
  </>
}
export default App;
