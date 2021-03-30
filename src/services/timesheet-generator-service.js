import { Chance } from 'chance'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)
const chance = new Chance()

export default class TimesheetGeneratorService {

    /* eslint-disable no-unused-vars */
    generateTimesheet(distributionProfile, projects) {
        const { capex, opex } = distributionProfile.distribution
        const capexTasks = this.getProjectsTasksOfType(projects, 'capex')
        const opexTasks = this.getProjectsTasksOfType(projects, 'opex')

        const weekTimesheet = {}
        for (let i = 1; i <= 5; i++) {
            console.log(`Generating timesheets for ${dayjs().day(i).format('dddd')}`)
            weekTimesheet[i] = {
                ...this.generateDayTimesheets(capex, capexTasks, 'CAPEX'),
                ...this.generateDayTimesheets(opex, opexTasks, 'OPEX')
            }
        }

        return weekTimesheet
    }

    getProjectsTasksOfType = (projects, taskType) => (
        projects.flatMap(project => project.tasks).filter(task => taskType === task.type)
    )

    generateDayTimesheets(minutesPerDay, tasks, note) {
        const timesheet = {}
        const targetQuarterHours = minutesPerDay / 15 // # of targeted quarter-hours as per the given minutes-per-day target

        const randomlyChosenTasks = chance.pickset(tasks, chance.natural({ min: Math.ceil(tasks.length * 0.5), max: tasks.length })) // Randomly choose a set of tasks
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