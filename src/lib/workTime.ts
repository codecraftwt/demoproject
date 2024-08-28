import {
  dateDiffInHours,
  dateDiffInMinutes,
  toHourTime,
  formatDate,
  convertTZToUTC,
  getUTCdayOfWeek,
  getStartOfDay,
  getEndOfDay,
} from './time'

export const getDoubleTimeAndOverTime = (projectData: any, timeCard: any, clockOutTime: any, deviceTZ: string) => {
  const diffInHours = (timeCard.workStartDateTimeUTC) ? dateDiffInHours(timeCard.workStartDateTimeUTC, clockOutTime) : 0
  // TODO: Do we need to handle lunch breaks for projectDayLength?
  const projectDayLength = dateDiffInHours(projectData.dailyStartTime, projectData.dailyEndTime)
  // TODO: Handle scenario when a clock-in and clock-out are on different days? 
  const dayOfWeekNumber = getUTCdayOfWeek(timeCard.workStartDateTimeUTC, deviceTZ)
  const regularTime = (diffInHours <= projectDayLength) ? diffInHours : projectDayLength
  const overTime = diffInHours - projectDayLength // anything over 8 is overtime.
  const doubleTime = (overTime <= 4) ? 0 : overTime - 4 // anything over 12 is double time.
  const totalTime = diffInHours
  // If no overtime, return 0.
  if (diffInHours <= projectDayLength) {
    return {
      overTime: 0,
      doubleTime: 0,
      dayOfWeek: dayOfWeekNumber,
      regularTime: diffInHours,
      totalTime: totalTime,
    }
  }
  switch (dayOfWeekNumber) {
    case 0: // Sunday.
      return {
        overTime: 0,
        doubleTime: diffInHours,
        dayOfWeek: dayOfWeekNumber,
        regularTime: 0,
        totalTime: totalTime,
      }
    case 6: // Saturday.
      return {
        overTime: overTime,
        doubleTime: doubleTime,
        dayOfWeek: dayOfWeekNumber,
        regularTime: regularTime,
        totalTime: totalTime,
      }
    default:
      return {
        overTime: overTime,
        doubleTime: doubleTime,
        dayOfWeek: dayOfWeekNumber,
        regularTime: regularTime,
        totalTime: totalTime,
      }
  }
}

export const getBufferedClockInTime = (projectData: any, clockInDate: any) => {
  const projectGraceTime = projectData.dailyGraceTime
  const projectStartHour = toHourTime(projectData.dailyStartTime)
  const projectStartTime = `${formatDate(clockInDate)} ${projectStartHour}`
  const projectStartTimeInUTC = convertTZToUTC(projectStartTime)
  const bufferedClockInTime = (Math.abs(dateDiffInMinutes(projectStartTimeInUTC, clockInDate)) <= projectGraceTime)
    ? projectStartTimeInUTC
    : clockInDate

  return bufferedClockInTime
}

export const getStartDateTime = (date: any) => {
  const startOfDate = getStartOfDay(date)
  const startDateTime = convertTZToUTC(startOfDate)
  return startDateTime
}

export const getEndDateTime = (date: any) => {
  const endOfDate = getEndOfDay(date)
  const endDateTime = convertTZToUTC(endOfDate)
  return endDateTime
}