export default class ClockifyService {

    constructor(httpClient) {
        this.httpClient = httpClient
    }

    async getUserInfo() {
        const { data } = await this.httpClient.get('/user')
        return data
    }

    async findProjectsByName(workspace, name) {
        let { data } = await this.httpClient.get(`/workspaces/${workspace}/projects?name=${name}`)
        return data.map(project => ({ id: project.id, name: project.name }))
    }

    async findProjectById(workspace, projectId) {
        let { data } = await this.httpClient.get(`/workspaces/${workspace}/projects/${projectId}`)
        return { id: data.id, name: data.name }
    }

    async getProjectTasks(workspace, projectId) {
        const { data } = await this.httpClient.get(`/workspaces/${workspace}/projects/${projectId}/tasks?is-active=true&page-size=200`)
        return data
    }

    async createTimeEntry(workspace, timeEntry) {
        await this.httpClient.post(`/workspaces/${workspace}/time-entries`, timeEntry)
    }

    async submitApprovalRequest(workspace, userId, weekStart) {
        const approvalRequest = { weekTime: weekStart }
        await this.httpClient.post(`https://global.api.clockify.me/workspaces/${workspace}/users/${userId}/approval-requests/`, approvalRequest)
    }

    async getWeekEntries(workspace, userId, weekStart) {
        const start = weekStart.format()
        const end = weekStart.add(1, 'week').subtract(1, 'millisecond').format()

        const entriesResponse = await this.httpClient.get(`https://global.api.clockify.me/workspaces/${workspace}/timeEntries/users/${userId}?start=${start}&end=${end}&hydrated=true&page-size=500`)
        const weekStatusResponse = await this.httpClient.get(`https://global.api.clockify.me/workspaces/${workspace}/users/${userId}/approval-requests/week-status?start=${weekStart.format()}`)

        const entries = entriesResponse.data
        const status = this.getWeekStatus(entries, weekStatusResponse.data)

        return { status, entries }
    }

    getWeekStatus(entries, weekStatus) {
        if (!entries.length) {
            return 'UNSUBMITTED'
        } else {
            if (entries[0].approvalRequestId) {
                return 'APPROVED'
            } else if (weekStatus.status === 'PENDING') {
                return 'PENDING'
            } else {
                return 'UNSUBMITTED'
            }
        }
    }

    async deleteTimeEntry(workspace, timeEntryId) {
        await this.httpClient.delete(`/workspaces/${workspace}/time-entries/${timeEntryId}`)
    }

    getTaskType(taskName) {
        return taskName.toLowerCase().includes('capex') ? 'capex' : 'opex'
    }

    getProjectIds(clockifyEntries) {
        return [...new Set(clockifyEntries.map(entry => entry.project.id))]
    }

    timeEntry = (start, end, projectId, taskId) => ({
        'start': start.toISOString(),
        'end': end.toISOString(),
        projectId,
        taskId
    })
}