export type DailyReportType = {
  project?: {
    projectName: string
    projectNumber: string
    clientName: string
    service: string
    locations: [
      {
        address: ""
      }
    ]
  }
  projectName: string
  activityLocation: string
  projectNumber: string
  clientName: string
  service: string
  locations?: [
    {
      address: ""
    }
  ]
  reportNumber: number
  date: string
  location?: string
  weather: string
  timesheets: {
    firstName: string
    lastName: string
    totalTimeWorkedInHours: string
    costcodes: { percentage: string; label: string }[]
  }[]
  equipment: {
    lineItemValue: string
  }[]
  materialsDelivered: {
    lineItemValue: string
  }[]
  workPerformed: string
  delaysAndImpacts: {
    lineItemValue: string
  }[]
  foreman: string
  projectManager: string
}
