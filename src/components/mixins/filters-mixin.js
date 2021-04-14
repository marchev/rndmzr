export default {
    filters: {
        weekday: date => date.format('dddd'),
        fulldate: date => date.format('ddd, MMM D'),
        hoursCount: date => date.format('H:mm'),
        uppercase: str => str.toUpperCase(),
        dropTaskPrefixSuffix: taskName => taskName
            .replace(' (OPEX)', '')
            .replace(' (CAPEX)', '')
            .replace(/[0-9]+\. /, '')
    }
}