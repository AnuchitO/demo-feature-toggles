import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Transfers from './Transfers'
import { FeatureTogglesProvider } from './FeatureTogglesContext'
import { DEMO_ACCOUNT } from './services/accounts';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { FloatingNavBar } from './FlotingNavBar';
import { Fragment } from 'react/jsx-runtime';

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
  { name: 'Dashboard', href: '/', current: true },
  { name: 'Transfer', href: '/transfer', current: false },
  { name: 'Projects', href: '#', current: false },
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const HamburgerIcon = () => {
  return <>
    {/* Mobile menu button (Hamberger) */}
    <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
      <span className="absolute -inset-0.5" />
      <span className="sr-only">Open main menu</span>
      <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
      <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
    </DisclosureButton>
  </>
}

export const MobileUseProfileMenu = () => {
  return <>
    <div className="border-t border-gray-700 pt-4 pb-3">
      <div className="flex items-center px-5">
        <div className="shrink-0">
          <img alt="" src={user.imageUrl} className="size-10 rounded-full" />
        </div>
        <div className="ml-3">
          <div className="text-base/5 font-medium text-white">{user.name}</div>
          <div className="text-sm font-medium text-gray-400">{user.email}</div>
        </div>
        <button
          type="button"
          className="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
        >
          <span className="absolute -inset-1.5" />
          <span className="sr-only">View notifications</span>
          <BellIcon aria-hidden="true" className="size-6" />
        </button>
      </div>
      <div className="mt-3 space-y-1 px-2">
        {userNavigation.map((item) => (
          <DisclosureButton
            key={item.name}
            as="a"
            href={item.href}
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            {item.name}
          </DisclosureButton>
        ))}
      </div>
    </div>
  </>
}

export const MobileNav = () => {
  return <>
    <div className="space-y-1 px-2 pt-2 pb-3 md:px-3">
      {navigation.map((item) => (
        <DisclosureButton
          key={item.name}
          as="a"
          href={item.href}
          aria-current={item.current ? 'page' : undefined}
          className={classNames(
            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'block rounded-md px-3 py-2 text-base font-medium',
          )}
        >
          {item.name}
        </DisclosureButton>
      ))}
    </div>
  </>
}

export const DesktopUserProfileMenu = () => {
  return <>
    {/* Profile dropdown */}
    <Menu as="div" className="relative ml-3">
      <div>
        <MenuButton className="relative flex items-center rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Open user menu</span>
          <img alt="" src={user.imageUrl} className="size-8 rounded-full" />
        </MenuButton>
      </div>
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        {userNavigation.map((item) => (
          <MenuItem key={item.name}>
            <a
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
            >
              {item.name}
            </a>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  </>
}

export const DestopNav = () => {
  return <>
    <div className="flex items-center">
      <div className="shrink-0">
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
          className="size-8"
        />
      </div>
      <div className="hidden md:block">
        <div className="ml-10 flex items-baseline space-x-4">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'rounded-md px-3 py-2 text-sm font-medium',
              )}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </div>
    <div className="hidden md:block">
      <div className="ml-4 flex items-center md:ml-6">
        <button
          type="button"
          className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
        >
          <span className="absolute -inset-1.5" />
          <span className="sr-only">View notifications</span>
          <BellIcon aria-hidden="true" className="size-6" />
        </button>

        <DesktopUserProfileMenu />
      </div>
    </div>

  </>
}

export const Menus = () => {
  return <>
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <DestopNav />
          <div className="flex md:hidden">
            <header className="shadow-sm">
              <div className="mx-auto px-4 py-6 md:px-6 lg:px-8">
                <h1 className="text-base font-bold tracking-tight">Dashboard</h1>
              </div>
            </header>
          </div>
          <div className="flex md:hidden">
            <HamburgerIcon />
          </div>
        </div>
      </div>

      <DisclosurePanel className="md:hidden">
        <MobileNav />
        <MobileUseProfileMenu />
      </DisclosurePanel>
    </Disclosure>
  </>
}

export const MockupCard: React.FC = () => {
  return (
    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px]">
      {/* Vertical lines */}
      <div className="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
      <div className="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>

      {/* Image Section */}
      <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800">
        {/* Light Mode Image */}
        <img
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/mockup-1-light.png"
          className="dark:hidden w-[272px] h-[572px]"
          alt="Light Mode Mockup"
        />
        {/* Dark Mode Image */}
        <img
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/mockup-1-dark.png"
          className="hidden dark:block w-[272px] h-[572px]"
          alt="Dark Mode Mockup"
        />
      </div>
    </div>
  );
};


export const MainContent: React.FC = () => {
  return <>
    <main>
      <div className="bg-gradient-radial min-w-[360px] from-[#A7C7E7] to-[#B3D9F7] mx-auto rounded-xl bg-white shadow-md max-w-2xl">
        <div className="mx-auto h-[calc(100vh-28px)] overflow-y-auto">
          <Menus />

          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/transfer" element={<Transfers account={DEMO_ACCOUNT} />} />
          </Routes>

          <FloatingNavBar />
        </div>
      </div >
    </main>
  </>
}


export function Page() {
  return (
    <>
      <Fragment>
        <FeatureTogglesProvider>
          <Router>
            <div className="hidden md:block relative mx-auto border-red-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] w-full">
              <div className="w-[148px] h-[24px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
              {/* Vertical lines */}
              <div className="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
              <div className="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
              <div className="rounded-[2rem] overflow-hidden h-[calc(100vh-28px)] bg-gray-800 dark:bg-gray-800">
                <MainContent />
              </div>
            </div>

            <div className="flex md:hidden">
              <MainContent />
            </div>
          </Router>
        </FeatureTogglesProvider>
      </Fragment>
    </>
  )
}

export default Page;
