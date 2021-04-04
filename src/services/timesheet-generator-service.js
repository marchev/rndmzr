import dayjs from '@/helpers/dayjs'
import { currentWeekStart } from '@/helpers/time-helpers'  
import { Chance } from 'chance'

const chance = new Chance()

export default class TimesheetGeneratorService {

    /* eslint-disable no-unused-vars */
    generateTimesheet(distributionProfile, projects) {
        const { capex, opex } = distributionProfile.distribution
        const capexTasks = this.getProjectsTasksOfType(projects, 'capex')
        const opexTasks = this.getProjectsTasksOfType(projects, 'opex')

        const timesheet = []
        for (let dayIndex = 0; dayIndex <= 4; dayIndex++) { // Monday through Friday only
            console.log(`Generating timesheets for ${currentWeekStart().add(dayIndex, 'day').format('dddd')}`)
            timesheet[dayIndex] = []

            const capexTimesheet = this.generateDayTimesheet(capex, capexTasks, 'CAPEX')
            const opexTimesheet = this.generateDayTimesheet(opex, opexTasks, 'OPEX')
            Object.entries(capexTimesheet).forEach(([taskId, duration]) => timesheet[dayIndex][taskId] = duration)
            Object.entries(opexTimesheet).forEach(([taskId, duration]) => timesheet[dayIndex][taskId] = duration)
        }

        return timesheet
    }

    getProjectsTasksOfType = (projects, taskType) => (
        projects.flatMap(project => project.tasks).filter(task => taskType === task.type)
    )

    generateDayTimesheet(minutesPerDay, tasks, note) {
        const timesheet = []
        const targetQuarterHours = minutesPerDay / 15 // # of targeted quarter-hours as per the given minutes-per-day target

        const randomlyChosenTasks = chance.pickset(tasks, chance.natural({ min: Math.ceil(tasks.length * 0.66), max: tasks.length })) // Randomly choose a set of tasks, but at least 2/3rds
        const randomQuarterHoursPerTask = this.generateRandomNumbersWhichSumTo(randomlyChosenTasks.length, targetQuarterHours)

        randomlyChosenTasks.forEach((task, index) => {
            timesheet[task.id] = dayjs.duration(15 * randomQuarterHoursPerTask[index], 'minutes')
        })

        console.log(`Generating ${note}: minutesPerDay=${minutesPerDay}`)
        console.log('All tasks: ', tasks)
        console.log('Randomly chosen tasks: ', randomlyChosenTasks)
        console.log(`${note} Timesheet: `, timesheet)

        return timesheet
    }

    /**
     * Implementation of the following algorithm:
     * https://math.stackexchange.com/questions/1276206/method-of-generating-random-numbers-that-sum-to-100-is-this-truly-random
     */
    generateRandomNumbersWhichSumTo(numOfRandomNumbers, randomNumbersSum) {
        if (numOfRandomNumbers === 1) {
            return [ randomNumbersSum ]
        }

        const randomNumbers = []
        const ceiling = randomNumbersSum + numOfRandomNumbers - 1

        const seedNumbers = chance.unique(chance.natural, numOfRandomNumbers - 1, { min: 1, max: ceiling })
        seedNumbers.sort((a, b) => a - b)

        for (let i = 0; i < numOfRandomNumbers; i++) {
            if (i === 0) {
                randomNumbers[i] = seedNumbers[i] - 1
            } else if (i === numOfRandomNumbers - 1) {
                randomNumbers[i] = ceiling - seedNumbers[i-1]
            } else {
                randomNumbers[i] = seedNumbers[i] - seedNumbers[i-1] - 1
            }
        }

        return randomNumbers
    }
}