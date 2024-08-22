import axios from "axios";


async function getAqiData30d(stationId: string | number) {
    const date = new Date()
    const { data } = await axios.post("https://enviinfo.cem.gov.vn/eip/default/call/json/get_aqi_data?date=30&aqi_type=0", {
        station_id: stationId,
        sEcho: 2,
        iColumns: 9,
        sColumns: ",,,,,,,,",
        iDisplayStart: 0,
        iDisplayLength: 0,
        added_columns: "CO,NO2,O3,PM-10,PM-2-5,SO2",
        // mDataProp_0: 0,
        // sSearch_0: null,
        // bRegex_0: false,
        // bSearchable_0: true,
        // mDataProp_1: 1,
        // sSearch_1: null,
        // bRegex_1: false,
        // bSearchable_1: true,
        // mDataProp_2: 2,
        // sSearch_2: null,
        // bRegex_2: false,
        // bSearchable_2: true,
        // mDataProp_3: 3,
        // sSearch_3: null,
        // bRegex_3: false,
        // bSearchable_3: true,
        // mDataProp_4: 4,
        // sSearch_4: null,
        // bRegex_4: false,
        // bSearchable_4: true,
        // mDataProp_5: 5,
        // sSearch_5: null,
        // bRegex_5: false,
        // bSearchable_5: true,
        // mDataProp_6: 6,
        // sSearch_6: null,
        // bRegex_6: false,
        // bSearchable_6: true,
        // mDataProp_7: 7,
        // sSearch_7: null,
        // bRegex_7: false,
        // bSearchable_7: true,
        // mDataProp_8: 8,
        // sSearch_8: null,
        // bRegex_8: false,
        // bSearchable_8: true,
        // sSearch: null,
        // bRegex: false,

    })

    if (!(data instanceof Object)) {
        console.debug('response data: ', data)
        throw new Error("Source Page response with invalid data")
    }

    if (!data.success) {
        console.debug('response data: ', data)
        throw new Error("Source Page response with non success data")
    }

    return {
        time: date.toISOString(),
        header: ["#", "date_time", "VN_AQI_day", "CO", "NO2", "O3", "PM-10", "PM-2-5", "SO2"],
        data: data.aaData,
    }
}

export default getAqiData30d

// DEBUG
if (require.main === module) {
    getAqiData30d('28505263793630246854465636760')
        .then(data => console.log(data))
}