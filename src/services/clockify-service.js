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

    async getTimeEntries(workspace, userId, weekStart) {
        const start = weekStart.format()
        const end = weekStart.add(1, 'week').subtract(1, 'millisecond').format()
        const { data } = await this.httpClient.get(`/workspaces/${workspace}/user/${userId}/time-entries?start=${start}&end=${end}&page-size=500`)
        return data
    }

    async deleteTimeEntry(workspace, timeEntryId) {
        await this.httpClient.delete(`/workspaces/${workspace}/time-entries/${timeEntryId}`)
    }

    getTaskType(taskName) {
        return taskName.toLowerCase().includes('capex') ? 'capex' : 'opex'
    }

    timeEntry = (start, end, projectId, taskId) => ({
        'start': start.toISOString(),
        'end': end.toISOString(),
        projectId,
        taskId
    })
}