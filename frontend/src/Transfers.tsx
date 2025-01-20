import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { NumericFormat } from 'react-number-format'
import { useNavigate } from 'react-router-dom'
import { Input, Field, Label, Select, Switch } from '@headlessui/react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { TransferButton } from './TransferButton'
import { CancelButton } from './CancelButton'
import { Accounts } from './Accounts'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import { Days, MonthDatePicker, SingleDatePicker } from './DatePicker'
import { transfer, scheduleTransfer } from './services/accounts'
import { bahtToSatang } from './formater'

interface TextProps {
  label: string;
  onChange: () => void;
}

export const Text = ({ label, onChange }: TextProps) => {
  return <>
    <div className="w-full max-w-md px-4 mt-2 mb-2 justify-start">
      <Field>
        <Label className="text-sm/6 font-medium text-white flex">{label}</Label>
        <Input
          className={clsx(
            'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
          )}
          onChange={onChange}
        />
      </Field>
    </div>
  </>
}


interface NumberProps {
  label: string;
  onChange: (value: number) => void;
}

export const Number = ({ label, onChange }: NumberProps) => {
  const defaultValue = '0.00'
  const [value, setValue] = useState(defaultValue)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: number = parseFloat(e.target.value.replace(/,/g, ''))
    onChange(value)
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === defaultValue) {
      setValue('')
    }
  }

  return (
    <div className="w-full max-w-md px-4 mt-2 mb-2 justify-start">
      <Field>
        <Label className="text-sm/6 font-medium text-white flex">{label}</Label>
        <NumericFormat
          className={clsx(
            'mt-3 block w-full text-right rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
          )}
          onChange={handleChange}
          onFocus={onFocus}
          value={value}
          decimalScale={2}
          thousandSeparator=","
          fixedDecimalScale />
      </Field>
    </div>
  )
}

export function SetSchedule({ onChange }: { onChange: (value: boolean) => void }) {
  const [enabled, setEnabled] = useState(false)

  const handleToggle = (value: boolean) => {
    setEnabled(value)
    onChange(value)
  }

  return (
    <>
      <div className="w-full max-w-md px-4 mt-2 mb-2">
        <Field>
          <div className="flex justify-between">
            <Label className="text-sm/6 font-medium text-white flex">Schedule</Label>
            <Switch
              checked={enabled}
              onChange={handleToggle}
              className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-green-500"

            >
              <span
                aria-hidden="true"
                className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
              />
            </Switch>
          </div>
        </Field>
      </div>
      {enabled && <ScheduleTab />}
    </>
  )
}


function ScheduleTab() {
  return (
    <div className="w-full max-w-md">
      <TabGroup>
        <TabList className="flex gap-4 justify-around">
          <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
          >Once</Tab>
          <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
          >Monthly</Tab>
        </TabList>
        <hr className="border-t border-gray-500 mt-1" />
        <TabPanels className="mt-3">
          <TabPanel>
            <div className="flex justify-center w-full mb-2">
              <Field className="flex flex-col items-start w-full">
                <Label className="mb-2" >Scheduled date</Label>
                <SingleDatePicker />
              </Field>
            </div>
          </TabPanel>
          <TabPanel>
            <div>
              <Days />
              <Field className="flex flex-col items-start m-4">
                <Label className="mb-2">From</Label>
                <MonthDatePicker />
              </Field>
              <Field className="flex flex-col items-start m-4">
                <Label className="mb-2">To</Label>
                <MonthDatePicker />
              </Field>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup >
    </div >
  )
}


interface ToAccountsProps {
  onSelect: (value: string) => void;
}

export function ToAccounts({ onSelect }: ToAccountsProps) {
  const [selectedAccount, setSelectedAccount] = useState<string>('KTB:111-111-111')

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedAccount(value)
    onSelect(value)
  }

  useEffect(() => {
    onSelect(selectedAccount)
  }, [selectedAccount])

  return (
    <div className="w-full max-w-md px-4 justify-start">
      <Field>
        <Label className="text-sm/6 font-medium text-white flex">To Bank Account</Label>
        <div className="relative">
          <Select
            className={clsx(
              'mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              '*:text-black'
            )}
            value={selectedAccount} // Set value to the selected account from state
            onChange={handleChange}  // Handle selection change
          >
            <option value="KTB:111-111-111">KTB 111-111-111</option>
            <option value="KTB:222-222-222">KTB 222-222-222</option>
            <option value="SCB:333-333-333">SCB 333-333-333</option>
            <option value="KBank:444-444-444">KBank 444-444-444</option>
          </Select>
          <ChevronDownIcon
            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
            aria-hidden="true"
          />
        </div>
      </Field>
    </div>
  )
}

// Define the payload types for transfer and schedule
interface TransferPayload {
  fromAccount: string;
  toAccount: string;
  toBank: string;
  amount: number;
  currency: string;
  note: string;
}

interface SchedulePayload {
  fromAccount: string;
  toAccount: string;
  toBank: string;
  amount: number;
  currency: string;
  type: string;
  note: string;
  schedule: string; // e.g., 'once', 'daily', etc.
  scheduleDate: string;
  endDate: string;
}

const Transfers = () => {
  const navigate = useNavigate()

  const [fromAccount, setFromAccount] = useState<string>('111-111-111')
  const [toAccount, setToAccount] = useState<string>('')
  const [toBank, setToBank] = useState<string>('')
  const [amount, setAmount] = useState<number>(0)
  const [note, setNote] = useState<string>('')
  const [isSchedule, setIsSchedule] = useState<boolean>(false)

  const onSelectToAccount = (value: string = ":") => {
    const [bank, account] = value.split(':')
    setToBank(bank)
    setToAccount(account)
  }

  // Mocking SetSchedule component for handling scheduling behavior
  const handleScheduleToggle = (value: boolean) => {
    setIsSchedule(value)
  }

  const goBack = () => {
    navigate('/')
  }

  const submitTransfer = async () => {
    const payload: TransferPayload = {
      fromAccount,
      toAccount,
      toBank,
      amount: bahtToSatang(amount),
      currency: 'THB',
      note,
    }

    try {
      const response = await transfer(payload)
      if (response.status === 'transferred') {
        console.log('Transfer successful')
        navigate('/') // Redirect after successful transfer
      } else {
        console.error('Failed to process transfer')
      }
    } catch (error) {
      console.error('Error during API call', error)
    }
  }

  return (
    <div>
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <div className="flex flex-col justify-center">
          <div>
            <Accounts />
          </div>
        </div>
        <div className="flex flex-col min-h-80 m-4">
          <div className="rounded-2xl shadow-lg">
            <div className="flex flex-col justify-center">
              <ToAccounts onSelect={onSelectToAccount} />
              <Number label="Amount" onChange={(amount) => { setAmount(amount) }} />
              <Text label="Note" onChange={(e) => setNote(e.target.value)} />
              <SetSchedule onChange={handleScheduleToggle} />
            </div>
            <div className="flex flex-row justify-center mt-2">
              <div className="flex one-space">
                <CancelButton label="Cancel" onClick={goBack} />
              </div>
              <div className="flex third-space">
                <TransferButton label="Confirm Transfer" onClick={submitTransfer} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transfers

