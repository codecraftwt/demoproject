import { useState, useEffect } from 'react'

function getStorageValue(key: string, defaultValue: any) {
  // getting stored value
  const saved = sessionStorage.getItem(key)
  const initial = saved ? JSON.parse(saved) : null
  return initial || defaultValue
}

export const useSessionStorage = (key: string, defaultValue: any) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue)
  })

  useEffect(() => {
    // storing input name
    sessionStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
};