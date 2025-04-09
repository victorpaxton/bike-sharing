import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { cn } from '../../lib/utils' // Assuming you have a cn utility

export interface ComboboxOption {
  id: string;
  name: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string | null; // The ID of the selected option
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function AppCombobox({ 
  options = [], 
  value,
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  isLoading = false,
}: ComboboxProps) {
  const [query, setQuery] = useState('')

  const selectedOption = options.find(option => option.id === value) || null;

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  return (
    <Combobox value={selectedOption} onChange={(option) => onChange(option ? option.id : null)} disabled={disabled || isLoading}>
      <div className="relative">
        <div className={cn(
          "relative w-full cursor-default overflow-hidden rounded-md border border-gray-300 bg-white text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 sm:text-sm",
          disabled || isLoading ? 'bg-gray-100 opacity-70 cursor-not-allowed' : '',
        )}>
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 bg-transparent disabled:cursor-not-allowed"
            displayValue={(option: ComboboxOption | null) => option?.name || ''}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isLoading ? 'Loading...' : placeholder}
            autoComplete="off"
            disabled={disabled || isLoading}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2" disabled={disabled || isLoading}>
            <ChevronsUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
            {filteredOptions.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <Combobox.Option
                  key={option.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-primary-600 text-white' : 'text-gray-900'
                    }`
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${ 
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {option.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-primary-600'
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
} 