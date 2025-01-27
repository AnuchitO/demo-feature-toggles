import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { useFeatureToggles } from './FeatureTogglesContext'
import { NumericFormat } from 'react-number-format'
import { useNavigate } from 'react-router-dom'
import { Input, Field, Label, Select, Switch, Button, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { TransferButton } from './TransferButton'
import { CancelButton } from './CancelButton'
import { Dialog } from './Modal'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import { Days, MonthDatePicker, SingleDatePicker } from './DatePicker'
import { transfer, scheduleTransfer } from './services/accounts'
import { bahtToSatang } from './formater'

import type { ScheduleTransferPayload, TransferPayload } from './types/account'
import type { Account } from './types/account';

interface TextProps {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const Text = ({ label, onChange, disabled = false }: TextProps) => {
  return <>
    <div className="w-full max-w-md px-4 mt-2 mb-2 justify-start">
      <Field>
        <Label className="text-sm/6 font-medium flex">{label}</Label>
        <Input
          disabled={disabled}
          className={clsx(
            `${disabled ? 'bg-neutral-900' : 'bg-white/5 dark:bg-gray-800'}`,
            'mt-3 block w-full rounded-lg  border border-gray-300 dark:border-none py-1.5 px-3 text-sm/6',
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
  disabled?: boolean;
}

export const Number = ({ label, onChange, disabled = false }: NumberProps) => {
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
  //     TestingLibraryElementError: Found a label with the text of: /Amount/i, however no form control was found associated to that label. Make sure you're using the "for" attribute or "aria-labelledby" attribute correctly.
  return (
    <div className="w-full max-w-md px-4 mt-2 mb-2 justify-start">
      <Field>
        <Label className="text-sm/6 font-medium flex">{label}</Label>
        <NumericFormat
          disabled={disabled}
          data-testId="amount"
          className={clsx(
            `${disabled ? 'bg-neutral-900' : 'bg-white/5 dark:bg-gray-800'}`,
            'mt-3 block w-full text-right rounded-lg border border-gray-300 dark:border-none py-1.5 px-3 text-sm/6',
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


interface SetScheduleProps {
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export function SetSchedule({ onChange, disabled = false }: SetScheduleProps) {
  const [active, setActive] = useState(false)

  const handleToggle = (value: boolean) => {
    setActive(value)
    onChange(value)
  }

  return (
    <>
      <div className="w-full max-w-md px-4 mt-2 mb-2">
        <Field>
          <div className="flex justify-between">
            <Label className="text-sm/6 font-medium flex">Schedule</Label>
            <Switch
              disabled={disabled}
              checked={active}
              onChange={handleToggle}
              data-testid="schedule-switch"
              className={clsx(
                `${disabled ? 'bg-neutral-900' : 'bg-white/5 dark:bg-gray-800'}`,
                "group relative flex h-7 w-14 cursor-pointer bg-gray-400 dark:border-none rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-green-500",
              )}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
              />
            </Switch>
          </div>
        </Field >
      </div >
    </>
  )
}


export interface ScheduleTabProps {
  onSetActiveTab: (value: TabType) => void;
  onSetDay: (day: string) => void;
  onSetScheduleDate: (date: string) => void;
  onSetStartDate: (date: string) => void;
  onSetEndDate: (date: string) => void;
}

function ScheduleTab({ onSetActiveTab, onSetScheduleDate, onSetDay, onSetStartDate, onSetEndDate }: ScheduleTabProps) {
  const { features } = useFeatureToggles()
  return (
    <div className="w-full max-w-md">
      <TabGroup>
        <TabList className="flex gap-4 justify-around">
          {
            features.enableScheduleOnce &&
            <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
              onClick={() => onSetActiveTab('ONCE')}
            >
              Once
            </Tab>
          }
          {
            features.enableScheduleMonthly &&
            <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
              onClick={() => onSetActiveTab('MONTHLY')}
            >
              Monthly
            </Tab>
          }
        </TabList>
        <hr className="border-t border-gray-500 mt-1" />
        <TabPanels className="mt-3">
          {
            features.enableScheduleOnce &&
            <TabPanel>
              <div className="flex justify-center w-full mb-2">
                <Field className="flex flex-col items-start w-full">
                  <Label className="mb-2" >Scheduled date</Label>
                  <SingleDatePicker onChange={date => onSetScheduleDate(date)} />
                </Field>
              </div>
            </TabPanel>
          }
          {
            features.enableScheduleMonthly &&
            <TabPanel>
              <div>
                <Days onChange={day => onSetDay(day)} />
                <Field className="flex flex-col items-start m-4">
                  <Label className="mb-2">From</Label>
                  <MonthDatePicker onChange={startDate => onSetStartDate(startDate)} />
                </Field>
                <Field className="flex flex-col items-start m-4">
                  <Label className="mb-2">To</Label>
                  <MonthDatePicker onChange={endDate => onSetEndDate(endDate)} />
                </Field>
              </div>
            </TabPanel>
          }
        </TabPanels>
      </TabGroup >
    </div >
  )
}


interface ToAccountsProps {
  disabled?: boolean;
  onSelect: (value: string) => void;
}

export function ToAccounts({ onSelect, disabled = false }: ToAccountsProps) {
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
        <Label className="text-sm/6 font-medium flex">To Bank Account</Label>
        <div className="relative">
          <Select
            disabled={disabled}
            className={clsx(
              `${disabled ? 'bg-neutral-900' : 'bg-white dark:bg-gray-800'}`,
              'mt-3 block w-full appearance-none rounded-lg border border-gray-300 dark:border-none py-1.5 px-3 text-sm/6',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              '*:text-black'
            )}
            value={selectedAccount}
            onChange={handleChange}
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

interface TransfersProps {
  account: Account;
}

type TabType = 'ONCE' | 'MONTHLY'

export const Transfers = ({ account }: TransfersProps) => {
  const navigate = useNavigate()

  const { features, loading: loadingFeatureToggle } = useFeatureToggles()

  const [isOpen, setIsOpen] = useState(false)
  const [disabled, setDisabled] = useState<boolean>(false)
  const [dialogContent, setDialogContent] = useState({
    title: "Transfer Successful",
    description: "Your transfer has been successfully processed."
  })

  const [isSchedule, setIsSchedule] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<TabType>('ONCE')

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const [fromAccount] = useState<string>(account.number)
  const [toAccount, setToAccount] = useState<string>('')
  const [toBank, setToBank] = useState<string>('')
  const [amount, setAmount] = useState<number>(0)
  const [note, setNote] = useState<string>('')

  const [scheduleDate, setScheduleDate] = useState<string>('')
  const [day, setDay] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  useEffect(() => {
    if (loadingFeatureToggle) {
      return
    }

    if (isSchedule) {
      if (features.enableScheduleOnce) {
        setActiveTab('ONCE')
      } else if (features.enableScheduleMonthly) {
        setActiveTab('MONTHLY')
      }
    }
  }, [loadingFeatureToggle, isSchedule])




  const onSelectToAccount = (value: string = ":") => {
    const [bank, account] = value.split(':')
    setToBank(bank)
    setToAccount(account)
  }

  const handleScheduleToggle = (value: boolean) => {
    setIsSchedule(value)
  }

  const goBackHome = () => {
    navigate('/')
  }

  const openDialog = (content: { title: string, description: string }) => {
    setDialogContent(content)
    setIsOpen(true)
  }

  const confirmDialog = () => {
    setIsOpen(false)
    goBackHome()
  }

  const closeDialog = () => {
    setIsOpen(false)
    goBackHome()
  }

  const handleScheduleTransfer = async () => {
    setError('')
    setLoading(true)
    setDisabled(true)

    const payload: ScheduleTransferPayload = {
      fromAccount,
      toAccount,
      toBank,
      amount: bahtToSatang(amount),
      currency: 'THB',
      note,
      schedule: activeTab,
      startDate: activeTab === "MONTHLY" ? `${startDate}-${day} 12:00:00` : scheduleDate + ' 12:00:00',
      endDate: activeTab === "MONTHLY" ? `${endDate}-${day} 12:00:00` : '',
    }

    try {
      const response = await scheduleTransfer(payload)
      if (response.status === 'SCHEDULED') {
        console.log('Schedule successful')
        openDialog({
          title: "Schedule Successful",
          description: "Your transfer has been successfully scheduled."
        })
      } else {
        setDisabled(false)
        setError('Failed to schedule transfer')
      }
    } catch (error) {
      setDisabled(false)
      setError('Failed to schedule transfer')
      console.error('Error during API call', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitTransfer = async () => {
    setError('')
    setLoading(true)
    setDisabled(true)

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
      if (response.status === 'TRANSFERRED') {
        console.log('Transfer successful')
        openDialog({
          title: "Transfer Successful",
          description: "Your transfer has been successfully processed."
        })
      } else {
        setDisabled(false)
        setError('Failed to process transfer')
      }
    } catch (error) {
      setDisabled(false)
      setError('Failed to process transfer')
      console.error('Error during API call', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col min-h-80 m-4 rounded-2xl text-gray-800 dark:text-white">
        <div className="rounded-2xl shadow-lg">
          <div className="flex flex-col justify-center">
            <ToAccounts disabled={disabled} onSelect={onSelectToAccount} />
            <Number disabled={disabled} label="Amount" onChange={(amount) => { setAmount(amount) }} />
            <Text disabled={disabled} label="Note" onChange={(e) => setNote(e.target.value)} />
            {
              (features.enableScheduleOnce || features.enableScheduleMonthly) &&
              <SetSchedule disabled={disabled} onChange={handleScheduleToggle} />
            }
            {isSchedule && <ScheduleTab onSetActiveTab={(tab) => setActiveTab(tab)}
              onSetScheduleDate={(date) => setScheduleDate(date)}
              onSetDay={(day) => setDay(day)}
              onSetStartDate={(date) => setStartDate(date)}
              onSetEndDate={(date) => setEndDate(date)}
            />}
          </div>
          {error && <p className="text-red-400 flex justify-center text-sm">{error}</p>}
          <div className="flex flex-row justify-center mt-2 mb-2">
            <div className="flex one-space">
              <CancelButton disabled={disabled} label="Cancel" onClick={goBackHome} />
            </div>
            <div className="flex third-space">
              {!isSchedule && <TransferButton loading={loading} disabled={disabled} label="Transfer" onClick={handleSubmitTransfer} />}
              {isSchedule && <TransferButton loading={loading} disabled={disabled} label="Schedule" onClick={handleScheduleTransfer} />}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        isOpen={isOpen}
        onClose={closeDialog}
        title={dialogContent.title}
        description={dialogContent.description}
      >
        <Button
          className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10"
          onClick={confirmDialog}
        >
          Got it, thanks!
        </Button>
      </Dialog>
    </div>
  )
}

export default Transfers

