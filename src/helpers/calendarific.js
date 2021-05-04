import dayjs from './dayjs'

export const getPublicHolidays = async (year) => {
    const holidaysCache = await caches.open('public-holidays')
    if (year === undefined) {
        year = dayjs().year()
    }
    let publicHolidaysUrl = `https://calendarific.com/api/v2/holidays?year=${year}&country=BG&type=national&api_key=bbaa9934838968e233681d85805c5b66c24dd83e`
    let holidaysResponse = await holidaysCache.match(publicHolidaysUrl)
    if (holidaysResponse === undefined) {
        await holidaysCache.add(publicHolidaysUrl)
        holidaysResponse = await holidaysCache.match(publicHolidaysUrl)
    }
    
    const holidays = (await holidaysResponse.json()).response.holidays
    /** Fix for duplicate holidays returned by calendarific */
    const seen = new Set()
    return holidays.filter(holiday => {
        const duplicate = seen.has(holiday.name)
        seen.add(holiday.name)
        return !duplicate
    })
}

export const getPublicHolidaysOnDate = async (date) => {
    const year = date.year()
    const publicHolidays = await getPublicHolidays(year)
    return publicHolidays
        .filter(publicHoliday => publicHoliday.date.iso === date.format('YYYY-MM-DD'))
        
}

export const isPublicHoliday = async (date) => {
    return (await getPublicHolidaysOnDate(date)).length > 0
}