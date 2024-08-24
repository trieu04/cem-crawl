import fs from 'fs';
import path from 'path';
import logger from './logger';
import getStationList from '../api/getStationList';

let stationIdList: string[] = []

const defaultConfig = {
    delayPerStation: 1000,
    delayPerRetry: 1000,
    maxRetry: 3,
    stationList: stationIdList,
}

export function loadStationList(stationListPath: string) {
    logger.info('Loading station list from ${stationListPath}')
    try {
        const stationList = JSON.parse(fs.readFileSync(stationListPath, 'utf8'))
        if (Array.isArray(stationList) && stationList.length > 0) {
            if (stationList.every((element) => typeof element === 'string')) {
                logger.info(`Read ${stationList.length} stations from config file`)
                defaultConfig.stationList = stationList
            }
            else if (stationList.every((element: any) => typeof element.id === 'string')) {
                logger.info(`Read ${stationList.length} stations from config file`)
                defaultConfig.stationList = stationList.map((element) => element.id)
            }
            else {
                logger.error('Invalid station list from config file')
                throw new Error('Invalid station list from config file')
            }
        }
        else {
            logger.error('Failed to get station list from config file')
            throw new Error('Failed to get station list from config file')
        }
    }
    catch (error) {
        logger.error('Failed to load station list from config file')
        throw error
    }
}

export async function loadStationListOnline() {
    logger.info('Getting station list from web')
    const data = await getStationList()
    if (!data) {
        logger.error('Failed to get station list')
        return
    }
    defaultConfig.stationList = data.map((station) => station.id)
}

export default defaultConfig;
