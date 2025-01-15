import { useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'


interface Props {
  onClick?: (value: string) => void
}

export function MonthlyDropdown({ onClick = () => { } }: Props) {
  const [selected, setSelected] = useState('Jan 2025')

  const handleSelect = (month: string) => {
    setSelected(month)
    onClick(month)
  }

  return (
    <Menu as="div" className="text-xs relative text-right border-0 focus:outline-none">
      <div>
        <MenuButton className="inline-flex w-full min-w-20 justify-center focus:outline-none gap-x-1.5 font-black text-slate-100">
          {selected}
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute border-0 right-0 z-10 mt-0 w-full min-w-20 origin-top-right divide-y divide-gray-100 rounded-md bg-gray-300 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in cursor-pointer"
      >
        <div className="py-1">
          <MenuItem as="div" onClick={() => handleSelect('Jan 2025')}>
            <p
              className="block px-4 py-2 text-xs text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
            >
              Jan 2025
            </p>
          </MenuItem>
          <MenuItem as="div" onClick={() => handleSelect('Dec 2024')}>
            <p
              className="block px-4 py-2 text-xs text-gray-700 data-[focus]:bg-black-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
            >
              Dec 2024
            </p>
          </MenuItem>
          <MenuItem as="div" onClick={() => handleSelect('Nov 2024')}>
            <p
              className="block px-4 py-2 text-xs text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
            >
              Nov 2024
            </p>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  )
}

