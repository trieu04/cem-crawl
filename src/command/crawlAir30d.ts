import fs from 'fs';
import { stringify } from 'csv-stringify/sync';
import logger from "../lib/logger";
import config from "../lib/config";
import getStationList from "../api/getStationList";
import axiosWithRetry from "../lib/axiosWithRetry";
import getAqiData30d from '../api/getAqiData30d';

const folderPath = './storage/crawl/air-daily'

export default async function main() {
    let stationIdList: string[] = []

    if (Array.isArray(config.stationList)) {
        if (config.stationList.length === 0) {
            logger.error('Station list is empty')
            return
        }
        if (typeof config.stationList[0] == 'string') {
            stationIdList = config.stationList
        }
        if (typeof config.stationList[0] == 'object') {
            stationIdList = config.stationList.map((station: any) => {
                if (station.id) return station.id
                else {
                    logger.error('Station object does not have id property')
                    logger.info('Station object: ', station)
                    return undefined
                }
            })
        }
    }
    else {
        const data = await getStationList()
        if (!data) {
            logger.error('Failed to get station list')
            return
        }
        stationIdList = data.map((station) => station.id)
    }
    stationIdList = stationIdList.filter((id) => typeof id === "string")

    
    for (const stationId of stationIdList) {
        try {
            logger.info(`[${stationId}] Getting air data for station`)
            const data = await getAqiData30d(stationId)
            logger.debug('Data:', data)

            fs.mkdirSync(folderPath, { recursive: true })

            const filePath = `${folderPath}/${stationId}.csv`
            
            if (fs.existsSync(filePath)) {
                logger.info(`[${stationId}] Appending data to existing file: ${filePath}`)
                fs.appendFileSync(filePath, stringify(data))
            }
            else {
                logger.info(`[${stationId}] Writing data to new file: ${filePath}`)
                const header = ['#', 'Date', 'VN_AQI', 'CO', 'NO2', 'O3', 'PM-10', 'PM-2-5', 'SO2']
                fs.writeFileSync(filePath, stringify([header, ...data]))
            }
        }
        catch (err) {
            logger.error(`[${stationId}] Failed crawl data for station`, err)
        }
        if (config.delayPerStation && stationId !== stationIdList[stationIdList.length - 1]) {
            logger.info(`[Delaying for next station] ${config.delayPerStation}ms`)
            await new Promise(resolve => setTimeout(resolve, config.delayPerStation))
        }
    }

}

if(require.main === module) {
    main()
}