import 'chrome-extension-async/chrome-extension-async'

export default class ProfileService {

    ENGINEERING_MANAGER = {
        distribution: {
            capex: 65,
            opex: 35
        },
        tasks: [
            // CAPEX
            { name: 'Execution - Business requirement, Software, Database and Technical Design (CAPEX)', type: 'capex' },
            { name: 'Execution - Technical Requirements (CAPEX)', type: 'capex' },
            { name: 'Execution - Daily Standup, sprint planning, demos, and retrospective (CAPEX)', type: 'capex' },
            { name: 'Execution - Software coding, code review and approval (CAPEX)', type: 'capex' },
            { name: 'Execution - Software Release Management (CAPEX)', type: 'capex' },
            { name: 'Execution - Testing (CAPEX)', type: 'capex' },
            // OPEX
            { name: 'Admin - 1-1 Meetings, Team meetings, Townhalls (OPEX)', type: 'opex' },
            { name: 'Admin - Hiring (OPEX)', type: 'capex' },
            { name: 'Admin - Internal Paysafe Training (OPEX)', type: 'capex' },
        ]
    }

    AGILE_DELIVERY_LEAD = {
        distribution: {
            capex: 40,
            opex: 60
        },
        tasks: []
    }

    ARCHITECT = {
        distribution: {
            capex: 95,
            opex: 5
        },
        tasks: []
    }

    PRODUCT_OWNER = {
        distribution: {
            capex: 90,
            opex: 10
        },
        tasks: []
    }

    CAPEX_OPEX_DISTRIBUTION = {
        'engineering-manager': this.ENGINEERING_MANAGER,
        'agile-delivery-lead': this.AGILE_DELIVERY_LEAD,
        'architect': this.ARCHITECT,
        'product-owner': this.PRODUCT_OWNER
    }

    getCapexOpexDistribution(profile) {
        return this.CAPEX_OPEX_DISTRIBUTION[profile]
    }
}