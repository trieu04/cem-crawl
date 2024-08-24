import fs from 'fs';
import { stringify } from 'csv-stringify/sync';
import logger from "../lib/logger";
import config, { loadStationList, loadStationListOnline } from "../lib/config";
import getAirAqi from '../api/getAirAqi';
import commandLineArgs from 'command-line-args';

const folderPath = './storage/crawl/air-daily'

let MAX_DATE = 30

export default async function main() {
    await loadConfig()

    let stationIdList = config.stationList
    if (stationIdList.length === 0) {
        logger.error("No station list found")
        return
    }

    logger.info('Station list:', {
        stationIdList: stationIdList
    })

    for (const stationId of stationIdList) {
        try {
            logger.info(`[${stationId}] Getting air data for station`)
            const data = await getAirAqi(stationId, { type: "daily", date: MAX_DATE })
            logger.debug('Data:', data)

            fs.mkdirSync(folderPath, { recursive: true })

            const filePath = `${folderPath}/${stationId}.csv`
            const body = data.reverse()

            if (fs.existsSync(filePath)) {
                logger.info(`[${stationId}] Appending data to existing file: ${filePath}`)
                fs.appendFileSync(filePath, stringify(body))
            }
            else {
                logger.info(`[${stationId}] Writing data to new file: ${filePath}`)
                const header = ['#', 'Date', 'VN_AQI', 'CO', 'NO2', 'O3', 'PM-10', 'PM-2-5', 'SO2']
                fs.writeFileSync(filePath, stringify([header, ...body]))
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

async function loadConfig() {
    const optionDefinitions = [
        { name: 'listStationFile', alias: 'f', type: String },
        { name: 'maxDate', alias: 'm', type: Number },
    ]

    const options = commandLineArgs(optionDefinitions)
    if (options.listStationFile) {
        logger.info('Loading station list from file')
        loadStationList(options.listStationFile)
    }
    else {
        logger.info('Loading station list online')
        await loadStationListOnline()
    }

    if (options.maxDate) {
        logger.info(`Setting max date to ${options.maxDate}`)
        MAX_DATE = options.maxDate
    }
}

if (require.main === module) {
    main()
}