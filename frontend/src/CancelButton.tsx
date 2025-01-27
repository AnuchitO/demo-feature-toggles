interface Props {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
}

export const CancelButton = ({ onClick, label = "Cancel", disabled = false }: Props) => {
  return <>
    <button type="button"
      onClick={onClick}
      disabled={disabled}
      className="py-2.5 px-5 me-2 mb-2 inline-flex items-center justify-center font-medium text-gray focus:outline-none rounded-full border border-gray-100 hover:bg-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
      <Icon />
      {label}
    </button>
  </>
}

export const Icon = () => (<>
  <svg
    className="w-7 h-7 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path fill-rule="evenodd" d="M18.645 5.291a1 1 0 0 1 .004 1.414L13.41 11.97l5.298 5.325a1 1 0 0 1-1.418 1.41L12 13.388l-5.291 5.317a1 1 0 0 1-1.418-1.41l5.298-5.325-5.238-5.265a1 1 0 0 1 1.418-1.41L12 10.552l5.231-5.257a1 1 0 0 1 1.414-.004Z" clip-rule="evenodd" />
  </svg>
</>)
