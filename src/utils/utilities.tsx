import * as Sentry from '@sentry/react'

export const validateArrayStructure = (
  outerArray: any[][]
): { isValid: boolean; invalidArrays: { index: number; array: any[] }[] } => {
  let invalidArrays: { index: number; array: any[] }[] = []

  // Exclude the last element if it's a single-element array with an empty string
  if (
    outerArray.length > 0 &&
    outerArray[outerArray.length - 1][0] === '' &&
    outerArray[outerArray.length - 1].length === 1
  ) {
    outerArray.pop()
  }

  outerArray.forEach((innerArray, index) => {
    if (
      !(
        Array.isArray(innerArray) &&
        innerArray.length === 2 &&
        !innerArray.includes('')
      )
    ) {
      invalidArrays.push({ index: index, array: innerArray })
    }
  })

  return { isValid: invalidArrays.length === 0, invalidArrays: invalidArrays }
}

export const handleScroll = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

export const fetchWithTimeoutAndRetry = async (
  fetchFunction: Function,
  args: any[],
  options: {
    timeout?: number
    retries?: number
    retryDelay?: number
    onRetry?: Function
  } = {}
) => {
  const { timeout = 10000, retries = 3, retryDelay = 1000, onRetry } = options
  let attempts = 0

  const executeFetch: any = async () => {
    attempts += 1
    try {
      const controller = new AbortController()
      const id = setTimeout(() => controller.abort(), timeout)
      const response = await fetchFunction(...args, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(id)
      return response
    } catch (error: any) {
      if (error.name === 'AbortError' && attempts < retries) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `Fetch attempt ${attempts} failed. Retrying in ${retryDelay}ms...`
          )
        } else {
          Sentry.captureException(new Error(`Fetch attempt ${attempts} failed`))
        }
        if (onRetry) onRetry(attempts)
        await new Promise(res => setTimeout(res, retryDelay))
        return executeFetch()
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error occurred in fetchWithTimeoutAndRetry: ', error)
        } else {
          Sentry.captureException(error)
        }
        throw error
      }
    }
  }

  return executeFetch()
}
