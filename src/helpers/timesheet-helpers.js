import dayjs from '@/helpers/dayjs'

export function getAllProjectsTasks(projects) {
    const allProjectsTasks = []
    projects.forEach(project => {
        project.tasks.forEach(task => allProjectsTasks.push(task.id))
    })
    return allProjectsTasks
}

export const isProfileTask = (task, distributionProfile) =>
    !!distributionProfile.tasks
        .filter(x => task.name.includes(x))
        .length

export const getDayEntries = (dayIndex, timeEntries) => {
    const dayEntries = []
    for (const taskId in timeEntries[dayIndex]) {
        const taskDuration = timeEntries[dayIndex][taskId]
        if (taskDuration.asMinutes() > 0) {
            dayEntries[taskId] = taskDuration
        }
    }
    return dayEntries
}

export const timeToStartEntries = (weekStart, dayIndex, workDayStart) =>
    weekStart.add(dayIndex, 'day').hour(workDayStart)

export const convertToTimesheet = (clockifyEntries, weekStart) => clockifyEntries.reduce((timesheet, entry) => {
        const entryStart = dayjs(entry.timeInterval.start)
        const dayIndex = entryStart.diff(weekStart, 'day')
        const taskId = entry.task.id
        const duration = dayjs.duration(entry.timeInterval.duration)

        if (!timesheet[dayIndex]) {
            timesheet[dayIndex] = []
        }
        timesheet[dayIndex][taskId] = duration;
        return timesheet
    },
    []
)