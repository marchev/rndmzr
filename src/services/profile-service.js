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
        tasks: []
    }

    ARCHITECT = {
        distribution: {
            capex: 450, // minutes per day
            opex: 30 // minutes per day
        },
        tasks: []
    }

    PRODUCT_OWNER = {
        distribution: {
            capex: 435, // minutes per day
            opex: 45 // minutes per day
        },
        tasks: []
    }

    DISTRIBUTION_PROFILE = {
        'engineering-manager': this.ENGINEERING_MANAGER,
        'agile-delivery-lead': this.AGILE_DELIVERY_LEAD,
        'architect': this.ARCHITECT,
        'product-owner': this.PRODUCT_OWNER
    }

    getDistributionProfile(profile) {
        return this.DISTRIBUTION_PROFILE[profile]
    }
}