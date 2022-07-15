import dayjs from '@/helpers/dayjs'
import Fraction from 'fraction.js'

export default class ProfileService {

    ENGINEERING_MANAGER = {
        distribution: {
            capex: 315, // minutes per day
            opex: 165 // minutes per day
        },
        tasks: [
            // CAPEX
            'Execution - Business requirement, Software, Database and Technical Design (CAPEX)',
            'Execution - Technical Requirements (CAPEX)',
            'Execution - Daily Standup, sprint planning, demos, and retrospective (CAPEX)',
            'Execution - Software coding, code review and approval (CAPEX)',
            'Execution - Software Release Management (CAPEX)',
            'Execution - Testing (CAPEX)',
            // OPEX
            'Admin - 1-1 Meetings, Team meetings, Townhalls (OPEX)',
            'Admin - Hiring (OPEX)',
            'Admin - Internal Paysafe Training (OPEX)'
        ]
    }

    AGILE_DELIVERY_LEAD = {
        distribution: {
            capex: 195, // minutes per day
            opex: 285 // minutes per day
        },
        tasks: [
            // CAPEX
            'Execution - Business requirement, Software, Database and Technical Design (CAPEX)',
            'Execution - Technical Requirements (CAPEX)',
            // OPEX
            'Production - KPI / Benefits Tracking (OPEX)',
            'KPI / Benefits Tracking (OPEX)',
            'Admin - 1-1 Meetings, Team meetings, Townhalls (OPEX)',
            'Admin - Internal Paysafe Training (OPEX)'
        ]
    }

    ARCHITECT = {
        distribution: {
            capex: 450, // minutes per day
            opex: 30 // minutes per day
        },
        tasks: [
            // CAPEX
            'Execution - Business requirement, Software, Database and Technical Design (CAPEX)',
            'Execution - Technical Requirements (CAPEX)',
            'Execution - Daily Standup, sprint planning, demos, and retrospective (CAPEX)',
            'Execution - Software coding, code review and approval (CAPEX)',
            // OPEX
            'Admin - 1-1 Meetings, Team meetings, Townhalls (OPEX)',
            'Admin - Internal Paysafe Training (OPEX)'
        ]
    }

    PRODUCT_OWNER = {
        distribution: {
            capex: 330, // minutes per day
            opex: 150 // minutes per day
        },
        tasks: [
            // CAPEX
            'Execution - Business requirement, Software, Database and Technical Design (CAPEX)',
            'Execution - Daily Standup, sprint planning, demos, and retrospective (CAPEX)',
            'Execution - Testing (CAPEX)',
            // OPEX
            'Business planning, gathering and analysis (OPEX)',
            'KPI / Benefits Tracking (OPEX)',
            'Admin - 1-1 Meetings, Team meetings, Townhalls (OPEX)',
            'Admin - Internal Paysafe Training (OPEX)'
        ]
    }

    DISTRIBUTION_PROFILE = {
        'engineering-manager': this.ENGINEERING_MANAGER,
        'agile-delivery-lead': this.AGILE_DELIVERY_LEAD,
        'architect': this.ARCHITECT,
        'product-owner': this.PRODUCT_OWNER
    }

    getDistributionProfile(profile) {
        if (!profile) {
            throw 'No profile has been configured'
        }
        
        return this.DISTRIBUTION_PROFILE[profile]
    }

    getExpectedDailyDistribution(profile, dailyTotal) {
        if (!profile) {
            throw 'No profile has been configured'
        }
        
        const capex = this.DISTRIBUTION_PROFILE[profile]['distribution']['capex']
        const opex = this.DISTRIBUTION_PROFILE[profile]['distribution']['opex']

        const capexFraction = Fraction(capex).div(capex + opex)
        const opexFraction = Fraction(opex).div(capex + opex)

        let expectedCapex = dayjs.duration(capexFraction.mul(dailyTotal.asMinutes()), 'minutes')
        let expectedOpex = dayjs.duration(opexFraction.mul(dailyTotal.asMinutes()), 'minutes')

        const expectedCapexMillis = expectedCapex.seconds() * 1000 + expectedCapex.milliseconds()
        const expectedOpexMillis = expectedOpex.seconds() * 1000 + expectedOpex.milliseconds()

        if (expectedCapexMillis >= 30_000) {
            expectedCapex = expectedCapex.add(expectedOpexMillis, 'ms')
            expectedOpex = expectedOpex.subtract(expectedOpexMillis, 'ms')
        } else {
            expectedCapex = expectedCapex.subtract(expectedCapexMillis, 'ms')
            expectedOpex = expectedOpex.add(expectedCapexMillis, 'ms')
        }

        return {
            capex: expectedCapex,
            opex: expectedOpex
        }
    }
}