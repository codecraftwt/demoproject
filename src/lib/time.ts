import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(tz)

// TODO: Add date validation
// e.g. dayjs(inputDate).isValid()
// https://day.js.org/docs/en/parse/is-valid

export const guessUserTZ = () => {
  // Guesses the user's current timezone
  return dayjs.tz.guess()
}

export const formatDate = (dateTime: string) => {
  return dayjs(dateTime).format('YYYY-MM-DD')
}

export const formattedDate = (dateTime: string) => {
  const date = dayjs(dateTime)
  const monthName = date.format('MMM')
  const day = date.format('D')
  const year = date.format('YYYY')
  const dayWithOrdinal = addOrdinalSuffix(day)
  return `${monthName} ${dayWithOrdinal}, ${year}`
}

function addOrdinalSuffix(day: any) {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const relevantDigits = day < 30 ? day % 20 : day % 30
  const suffix = relevantDigits <= 3 ? suffixes[relevantDigits] : suffixes[0]
  return `${day}${suffix}`
}

export const formatDateMMDDYYYY = (dateTime: string) => {
  return dayjs(dateTime).format('MM-DD-YYYY')
}

export const formatDateTime = (dateTime: string) => {
  return dayjs(dateTime).format('MM/DD/YYYY h:mm A')
}

export const formatTime = (dateTime: string) => {
  return dayjs(dateTime).format('h:mm A')
}
export const formatTimes = (time: string) => {
  return dayjs(time, 'hh:mm A').format('hh:mm A')
}

export const getStartOfDay = (dateTime: string) => {
  return dayjs(dateTime).startOf('day').format()
}

export const getEndOfDay = (dateTime: string) => {
  return dayjs(dateTime).endOf('day').format()
}

export const toHourTime = (dateTime: string) => {
  return dayjs(dateTime).format('h:mm A')
}

export const toHourTimeAlt = (dateTime: string) => {
  return dayjs(dateTime).format('hh:mm A')
}

export const getCurrentDate = () => {
  return dayjs().format('MM/DD/YYYY')
}

export const getCurrentDateISOFormat = () => {
  return dayjs().format('YYYY-MM-DD')
}

export const getCurrentDateTime = (format?: string) => {
  if (format) {
    return dayjs().format(format)
  }
  return dayjs().format('MM/DD/YYYY h:mm A')
}

export const getTwoHoursBefore = (format?: string) => {
  const twoHoursBefore = dayjs().subtract(2, 'hour')
  if (format) {
    return twoHoursBefore.format(format)
  }
  return twoHoursBefore.format('MM/DD/YYYY h:mm A')
}

export const getDateTimeNowUTC = () => {
  // e.g. 2019-03-06T00:00:00Z
  return dayjs.utc().format()
}

export const getDateNowUTC = () => {
  // e.g. 2019-03-06T00:00:00Z
  return dayjs.utc().format('MM/DD/YYYY')
}

export const setTZForDateAndFormatDateOnly = (
  inputDate: string,
  timezone?: string
) => {
  return dayjs(inputDate)
    .tz(timezone || guessUserTZ())
    .format('MM/DD/YYYY')
}

export const setTZForDateAndFormatDateOnlyDashes = (
  inputDate: string,
  timezone?: string
) => {
  return dayjs(inputDate)
    .tz(timezone || guessUserTZ())
    .format('MM-DD-YYYY')
}

export const setTZForDateAndFormatTimeOnly = (
  inputDate: string,
  timezone?: string
) => {
  return dayjs(inputDate)
    .tz(timezone || guessUserTZ())
    .format('h:mm A')
}

export const setTZForDate = (inputDate: string, timezone?: string) => {
  // Pass in datetimes from the frontend
  // Sets the correct timezone for a datetime
  return dayjs(inputDate)
    .tz(timezone || guessUserTZ())
    .format()
}

export const convertTZToUTC = (tzDate: string) => {
  // Call setTZForDate() first
  // Converts datetime set in a timezone to UTC
  return dayjs(tzDate).utc().format()
}

export const convertUTCToTZ = (utcDate: string, timezone?: string) => {
  // Converts UTC to a specified timezone
  return dayjs
    .utc(utcDate)
    .tz(timezone || guessUserTZ())
    .format('MM/DD/YYYY h:mm A')
}

export const convertUTCToTZDateOnly = (utcDate: string, timezone?: string) => {
  // Converts UTC to a specified timezone
  return dayjs
    .utc(utcDate)
    .tz(timezone || guessUserTZ())
    .format('MM/DD/YYYY')
}

export const convertUTCToTZTimeOnly = (utcDate: string, timezone?: string) => {
  // Converts UTC to a specified timezone
  return dayjs
    .utc(utcDate)
    .tz(timezone || guessUserTZ())
    .format('h:mm A')
}

export const dateDiffInHoursAndMinutes = (date1: string, date2: string) => {
  // Return the difference between two dates in hours and minutes
  const start = dayjs(date1)
  const end = dayjs(date2)
  const timeDiffInSeconds = end.diff(start, 'second')
  const totalHours = Math.floor(timeDiffInSeconds / (60 * 60)) // How many hours?
  const totalSeconds = timeDiffInSeconds - totalHours * 60 * 60 // Pull those hours out of totalSeconds
  const totalMinutes = Math.floor(totalSeconds / 60) // With hours out this will return minutes
  return {
    hours: totalHours,
    minutes: totalMinutes,
  }
}

export const dateDiffInHours = (date1: string, date2: string) => {
  // Return the difference between two dates in hours
  const start = dayjs(date1)
  const end = dayjs(date2)

  return end.diff(start, 'hour', true)
}

export const dateDiffInMinutes = (date1: string, date2: string) => {
  // Return the difference between two dates in hours
  const start = dayjs(date1)
  const end = dayjs(date2)

  return end.diff(start, 'minutes', true)
}

export const dateDiffInMinuteWithHours = (date1: string, date2: string) => {
  const start = dayjs(date1)
  const end = dayjs(date2)
  const diffMinutes = end.diff(start, 'minutes')

  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60

  const formattedMinutes = minutes?.toString().padStart(2, '0')

  return `${hours}:${formattedMinutes}`
}

export const dateIsAfter = (date1: string, date2: string) => {
  const start = dayjs(date1)
  const end = dayjs(date2)

  return end.isAfter(start)
}

export const getUTCdayOfWeek = (utcDate: string, timeZone: string) => {
  const dateTimeNowLocal = convertUTCToTZ(utcDate, timeZone)
  return dayjs(dateTimeNowLocal).day()
}

export const getDate = (date: string) => {
  console.log('date in ===>', date)
  return dayjs(date).date()
}
