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

    getTaskType(taskName) {
        return taskName.toLowerCase().includes('capex') ? 'capex' : 'opex'
    }
}