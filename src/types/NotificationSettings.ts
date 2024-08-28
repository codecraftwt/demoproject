interface NotificationSettings {
  sendDailyReportReminder: boolean;
  defaultTimeForReminders: string | null;
  defaultTimeForRemindersUTC: string | null;
  sendDailyClockOutReminder: boolean;
  sendAllProjectActivityUpdates: boolean;
  sendSingleEmailPerProject: boolean;
  sendSingleEmailPerProjectTimeInterval: "Once a day" | "As it happens";
  lunchDuration: number;
}

export default NotificationSettings;
