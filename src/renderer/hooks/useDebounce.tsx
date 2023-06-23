import { useEffect, useState } from 'react'

export type Value = string | number | null | any
export type Delay = number

export default function useDebounce(value: Value, delay: Delay) {
  const [debounce, setDebounce] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounce(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debounce
}
