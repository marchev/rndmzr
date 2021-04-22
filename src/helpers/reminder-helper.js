import dayjs from './dayjs'

export const isItReminderTime = (reminderDays, reminderTime) => {
    const timeToRemind = dayjs(reminderTime)

    for (const day of reminderDays) {
        const reminderDateTime = dayjs().day(day).hour(timeToRemind.hour()).minute(timeToRemind.minute())
        const currentDateTime = dayjs.utc()
        if (reminderDateTime.isSame(currentDateTime, 'minute')) {
            return true
        }
    }

    return false
}