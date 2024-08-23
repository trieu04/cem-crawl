import fs from 'fs';
import { stringify } from 'csv-stringify/sync';
import logger from "../lib/logger";
import getStationList from "../api/getStationList";
import { format } from 'date-fns';

const folderPath = './storage/crawl/station-list'

export default async function main() {
    const now = new Date()
    const data = await getStationList()
    if (!data) {
        logger.error('Failed to get station list')
        return
    }

    fs.mkdirSync(folderPath, { recursive: true })

    const filePath = `${folderPath}/stationlist_${format(now, 'yyyyMMdd_HHmmss')}.csv`

    const header = ['id', 'name', 'lat', 'lon', 'province', 'address']
    const body = data.map((station) => [station.id, station.name, station.lat, station.lon, station.province, station.address])
    fs.writeFileSync(filePath, stringify([header, ...body]))
    logger.info(`Writing csv to new file: ${filePath}`)
    
    const filePathJson = `${folderPath}/stationlist_${format(now, 'yyyyMMdd_HHmmss')}.json`
    fs.writeFileSync(filePathJson, JSON.stringify(data, null, 2))
    logger.info(`Writing json to new file: ${filePathJson}`)
}

if (require.main === module) {
    main()
}