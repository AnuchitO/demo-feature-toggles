import { useState } from 'react'
import "./App.css"
import { TransferButton } from './TransferButton'
import { TransactionButton } from './TransactionButton'
import { ScheduleButton } from './ScheduleButton'
import { Accounts } from './Accounts'
import { Transactions } from './Transactions'
import { Schedules } from './Schedules'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'



const App = () => {
  const [tab, setTab] = useState('transaction')

  const onClickTransfer = () => {
    setTab('transfer')
  }

  const onClickTransaction = () => {
    setTab('transaction')
  }

  const onClickSchedule = () => {
    setTab('schedule')
  }

  const onClickAccount = () => {
    setTab('transaction')
  }

  if (tab === 'transfer') {
    return <>
      <div>
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <div className="flex flex-col justify-center" >
            <TransferButton label="Accounts" onClick={onClickAccount} />
          </div>
          <div className="flex flex-col justify-center" >
            <div>
              <p>Bank</p>
              <p>Select Bank</p>
            </div>
            <div>
              <p>Account number</p>
              <p>Account no</p>
            </div>
            <div>
              <p>Note</p>
              <p>memo</p>
            </div>
          </div>
          <div className="flex flex-col min-h-80  m-4" >
            <div>
              <p>Schedule</p>
              <p>Toggle</p>
            </div>
            <div>
              <p>Tab Once</p>
              <p>Scheduled date</p>
              <p>Select date</p>
            </div>
            <div>
              <p>Tab Monthly</p>
              <p>Every</p>
              <p>Dropdown date</p>

              <p>From</p>
              <p>Dropdown month Year</p>

              <p>To</p>
              <p>Dropdown month Year</p>
            </div>
          </div>
        </div>
      </div >
    </>
  }


  return <>
    <div>
      <div className="rounded-2xl overflow-hidden shadow-lg">
        {/* <div className="flex justify-center bg-gradient-to-r from-green-300 via-blue-500 to-purple-600" > */}
        <div className="flex flex-col justify-center" >
          <TransferButton label="Transfer" onClick={onClickTransfer} />
        </div>
        <div className="flex flex-col justify-center" >
          <div>
            <Accounts />
          </div>
          <div>
            <TransactionButton onClick={onClickTransaction} />
            <ScheduleButton onClick={onClickSchedule} />
          </div>
        </div>
        <div className="flex flex-col min-h-80  m-4" >
          {tab === 'transaction' && <>
            <Transactions />
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
