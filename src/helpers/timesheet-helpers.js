import dayjs from '@/helpers/dayjs'
import { zeroDuration } from '@/helpers/time-helpers'

const DAY_OFF_TASK = 'Absence - Day off'
const TRAINING_TASK = 'Admin - Internal Paysafe Training'

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

export const findDayOffTask = (projects) => projects
    .flatMap(project => project.tasks)
    .filter(task => task.name.includes(DAY_OFF_TASK))
    .shift()

export const findTrainingTask = (projects) => projects
    .flatMap(project => project.tasks)
    .filter(task => task.name.includes(TRAINING_TASK))
    .shift()

/* eslint-disable no-unused-vars */
export const getAllTimesheetTaskIds = (timeEntries) =>
    [...new Set(timeEntries
        .flatMap(dayEntry =>
            Object.entries(dayEntry)
                .filter(([taskId, duration]) => duration.asMinutes() > zeroDuration().asMinutes())
                .map(([taskId, duration]) => taskId)
        ))]