export default class ClockifyService {

    constructor(httpClient) {
        this.httpClient = httpClient
    }

    async getUserInfo() {
        const { data } = await this.httpClient.get('/user')
        return data
    }
}