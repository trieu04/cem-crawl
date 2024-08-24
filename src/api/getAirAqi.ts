import axiosWithRetry from "../lib/axiosWithRetry"
import logger from "../lib/logger"


type Option = {
    type: "daily"
    date: number
} | {
    type: "hourly"
    date: undefined
}

export default async function getAirAqi(stationId: string | number, option: Option) {
    const params = {
        aqi_type: option.type === "daily" ? 0 : 1,
        date: option.date === undefined ? 1 : option.date
    }
    const res = await axiosWithRetry.post("https://enviinfo.cem.gov.vn/eip/default/call/json/get_aqi_data", {
        station_id: stationId,
        sEcho: 2,
        iColumns: 9,
        sColumns: ",,,,,,,,",
        iDisplayStart: 0,
        iDisplayLength: 0,
        added_columns: "CO,NO2,O3,PM-10,PM-2-5,SO2",
    }, {
        params: params
    })

    if (!res.data) {
        logger.error('Request failed with no response data')
        throw new Error("Request failed with no response data")
    }

    const data = res.data

    if (!data.success) {
        logger.error('Request failed with non success data', {
            responseData: data
        })

        throw new Error("Request failed with non success data")
    }

    if (!data.aaData || !Array.isArray(data.aaData)) {
        logger.error('Request failed with unexpected data format', {
            responseData: data
        })

        throw new Error("Request failed with unexpected data format")
    }

    return Array.from(data.aaData)
}

if(require.main === module) {
    getAirAqi("28505268571336961948594948504", { type: "daily", date: 30 })
        .then(data => console.log(data))
}