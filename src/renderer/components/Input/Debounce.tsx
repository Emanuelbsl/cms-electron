import React, {
  InputHTMLAttributes,
  forwardRef,
  useEffect,
  useState,
} from 'react'

import useDebounce from '@renderer/hooks/useDebounce'

export type Ref = HTMLInputElement

interface IInputElement extends InputHTMLAttributes<HTMLInputElement> {
  onChangeValue?: (value: string | null) => void
  timeDebounce?: number
}

export const InputDebounce = forwardRef<Ref, IInputElement>((props, ref) => {
  const { onChangeValue, timeDebounce = 1000, defaultValue } = props
  const [value, setValue] = useState<string | null>(null)
  const debounce = useDebounce(value, timeDebounce)
  const [success, setSuccess] = useState<boolean>(false)

  useEffect(() => {
    if (value) {
      setSuccess(true)
      const timeout = setTimeout(() => {
        setSuccess(false)
      }, 1000)
      onChangeValue && onChangeValue(value)
      return () => {
        clearTimeout(timeout)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounce])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    const value = target?.value || null
    setValue(value)
  }

  return (
    <div className="relative">
      <input
        ref={ref}
        className="disabled:cursor-not-allowed block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={handleChange}
        {...props}
      />
    </div>
  )
})

InputDebounce.displayName = 'Input'

export default InputDebounce
