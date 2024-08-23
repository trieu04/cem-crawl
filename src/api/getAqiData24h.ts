import axiosWithRetry from "../lib/axiosWithRetry"
import logger from "../lib/logger"

export default async function getAqiData24h(stationId: string | number) {
    const res = await axiosWithRetry.post("https://enviinfo.cem.gov.vn/eip/default/call/json/get_aqi_data?date=1&aqi_type=1", {
        station_id: stationId,
        sEcho: 2,
        iColumns: 9,
        sColumns: ",,,,,,,,",
        iDisplayStart: 0,
        iDisplayLength: 0,
        added_columns: "CO,NO2,O3,PM-10,PM-2-5,SO2",
    })

    if (!res.data) {
        logger.error('Request failed with no response data')
        throw new Error
    }

    const data = res.data

    if (!data.success) {
        logger.error('Request failed with non success data')
        logger.debug('response data: ', data)
        throw new Error
    }

    if (!data.aaData && !Array.isArray(data.aaData)) {
        logger.error('Request failed with unexpected data format')
        logger.debug('response data: ', data)
        throw new Error
    }

    return data.aaData
}