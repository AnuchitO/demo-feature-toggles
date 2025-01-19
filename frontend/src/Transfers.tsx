import clsx from 'clsx'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Field, Label, Select, Switch } from '@headlessui/react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { TransferButton } from './TransferButton'
import { CancelButton } from './CancelButton'
import { Accounts } from './Accounts'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import { Days, MonthDatePicker, SingleDatePicker } from './DatePicker'

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
  onChange: () => void;
}

export const Number = ({ label, onChange }: NumberProps) => {
  return <>
    <div className="w-full max-w-md px-4 mt-2 mb-2 justify-start">
      <Field>
        <Label className="text-sm/6 font-medium text-white flex">{label}</Label>
        <Input
          type="number"
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


export function SetSchedule() {
  const [enabled, setEnabled] = useState(false)

  return (
    <>
      <div className="w-full max-w-md px-4 mt-2 mb-2">
        <Field>
          <div className="flex justify-between">
            <Label className="text-sm/6 font-medium text-white flex">Schedule</Label>
            <Switch
              checked={enabled}
              onChange={setEnabled}
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
export function Banks() {
  return (
    <div className="w-full max-w-md px-4 justify-start">
      <Field>
        <Label className="text-sm/6 font-medium text-white flex">Bank</Label>
        <div className="relative">
          <Select
            className={clsx(
              'mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              '*:text-black'
            )}
          >
            <option value="KTB">KTB</option>
            <option value="SCB">SCB</option>
            <option value="KBank">KBank</option>
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


const Transfers = () => {
  const navigate = useNavigate()

  const goBack = () => {
    navigate('/')
  }

  return <>
    <div>
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <div className="flex flex-col justify-center" >
          <div>
            <Accounts />
          </div>
        </div>
        <div className="flex flex-col min-h-80  m-4" >
          <div className="rounded-2xl shadow-lg">
            <div className="flex flex-col justify-center" >
              <Banks />
              <Number label="Account Number" onChange={(e) => { console.log(e) }} />
              <Text label="Note" onChange={(e) => { console.log(e) }} />
              <SetSchedule />
            </div>
            <div className="flex flex-row justify-center mt-2" >
              <div className="flex one-space">
                <CancelButton label="Cancel" onClick={goBack} />
              </div>
              <div className="flex third-space">
                <TransferButton label="Confirm Transfer" onClick={goBack} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >


  </>
}
export default Transfers;
