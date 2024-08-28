import { useEffect, useMemo, useRef } from "react"
import debounce from 'lodash.debounce'

export const useDebounce = (callback: any) => {
  const ref = useRef<any | null>(null)

  useEffect(() => {
    ref.current = callback
  }, [callback])

  const debouncedCallback = useMemo(() => {
    const func = () => {
        ref.current?.()
    }

    return debounce(func, 500)
  }, [])

  return debouncedCallback;
}