import axios from "axios";


async function getQiDetailEip(stationId: string | number) {
    const { data } = await axios.post("https://enviinfo.cem.gov.vn/eos/services/call/json/qi_detail_for_eip", {
        station_id: stationId,
        station_type: 4,
        from_public: 1,
    })

    if (!(data instanceof Object)) {
        throw new Error("Source Page response with invalid data")
    }

    if (!data.success) {
        console.debug('response data: ', data)
        throw new Error("Source Page response with non success data")
    }

    const getParameter = (obj: any) => {
        return {
            current: obj.current,
            max: obj.max,
            min: obj.min,
            values: Array.from(obj.values).map((obj: any) => {
                const entries = Object.entries(obj)
                if (entries.length === 0) return null
                return {
                    time: entries[0][1] as string,
                    value: Number(entries[0][0])
                }
            }),
        }
    }

    return {
        qiDescripion: data.qi_detail_info.description,
        stationName: data.station_name,
        qiTime1: data.qi_time_1,
        qiTime2: data.qi_time_2,
        qiValue: data.qi_value,
    }
}


// DEBUG
if (require.main === module) {
    getQiDetailEip('28505263793630246854465636760')
        .then(data => console.log(data))
}