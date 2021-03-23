import 'chrome-extension-async/chrome-extension-async'

export default class ProfileService {

    ENGINEERING_MANAGER_DISTRIBUTION = {
        'CAPEX': {
            weight: 65,
            activities: [
                'Execution - Business requirement, Software, Database and Technical Design (CAPEX)',
                'Execution - Technical Requirements (CAPEX)',
                'Execution - Daily Standup, sprint planning, demos, and retrospective (CAPEX)',
                'Execution - Software coding, code review and approval (CAPEX)',
                'Execution - Software Release Management (CAPEX)',
                'Execution - Testing (CAPEX)',
            ]
        },
        'OPEX': {
            weight: 35,
            activities: [
                'Admin - 1-1 Meetings, Team meetings, Townhalls (OPEX)',
                'Admin - Hiring (OPEX)',
                'Admin - Internal Paysafe Training (OPEX)',
            ]
        }
    }

    AGILE_DELIVERY_LEAD_DISTRIBUTION = {
        'CAPEX': {
            weight: 40,
            activities: [
                
            ]
        },
        'OPEX': {
            weight: 60,
            activities: [
                
            ]
        }
    }

    ARCHITECT = {
        'CAPEX': {
            weight: 95,
            activities: [
                
            ]
        },
        'OPEX': {
            weight: 5,
            activities: [
                
            ]
        }
    }

    PRODUCT_OWNER = {
        'CAPEX': {
            weight: 90,
            activities: [
                
            ]
        },
        'OPEX': {
            weight: 10,
            activities: [
                
            ]
        }
    }

    CAPEX_OPEX_DISTRIBUTION = {
        'engineering-manager': this.ENGINEERING_MANAGER_DISTRIBUTION,
        'agile-delivery-lead': this.AGILE_DELIVERY_LEAD_DISTRIBUTION,
        'architect': this.ARCHITECT,
        'product-owner': this.PRODUCT_OWNER
    }

    async getActiveProfile() {
        const settings = await chrome.storage.sync.get(['profile'])
        const { profile } = settings
        return profile
    }

    getCapexOpexDistribution(profile) {
        return this.CAPEX_OPEX_DISTRIBUTION[profile]
    }

}