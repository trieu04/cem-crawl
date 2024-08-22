import axios from "axios";
import axiosRetry from "axios-retry";
import getAqiData24h from "../api/getAqiData24h";
import getAqiData30d from "../api/getAqiData30d";
import getStationList from "../api/getStationList";
import fs from 'fs';
import util from 'util';
import config from "../config";
import formatDate from "../utils/formatDate";

// Config axios retry for all requests
axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.linearDelay(config.delayPerRetry)
});

let controller = new AbortController();

type StationData = {
    id: string,
    name: string,
    lat: string,
    lon: string,
    province: string,
    address: string,
    data24h: any,
    data30d: any,
}


export default async function crawlAllData() {
    const stationList = await getStationList()

    const now = new Date()

    const crawledData: {
        time: string,
        stationList: any,
        data: StationData[]
    } = {
        time: now.toISOString(),
        stationList: stationList,
        data: [],
    }

    for (const station of stationList) {
        console.log('[Crawling data for station]', station.id, station.name)

        if (controller.signal.aborted) {
            break;
        }

        try {
            if (station !== stationList[0]) {
                if (config.delayPerStation) {
                    console.log('[Delaying for next station]', config.delayPerStation + 'ms')
                    await new Promise(resolve => setTimeout(resolve, config.delayPerStation))
                }
            }

            const stationData: StationData = {
                id: station.id,
                name: station.name,
                lat: station.lat,
                lon: station.lon,
                province: station.province,
                address: station.address,
                data24h: null,
                data30d: null,
            }

            const [data24h, data30d] = await Promise.allSettled([
                getAqiData24h(station.id),
                getAqiData30d(station.id),
            ])

            if (data24h.status === 'rejected') {
                console.error(`Failed to get 24h data for station ${station.id}`)
            }
            else {
                stationData.data24h = data24h.value
            }

            if (data30d.status === 'rejected') {
                console.error(`Failed to get 30d data for station ${station.id}`)
            }
            else {
                stationData.data30d = data30d.value
            }

            console.log('[station]', util.inspect(stationData, { depth: 1 }))
            crawledData.data.push(stationData)

        } catch (error) {
            console.error(`Failed to get data for station ${station.id}-${station.name}`)
        }

    }

    console.log('[saving crawled data]')


    const filePath = `./storage/crawl/`;
    const fileName = `allstation_${formatDate(now)}.json`;

    fs.mkdirSync(filePath, { recursive: true });

    fs.writeFileSync(filePath + fileName, JSON.stringify(crawledData, null, 4),);

    console.log(`[Crawled data saved to] ${filePath}`)
}

function gracefulShutdown() {
    controller.abort()
    console.info('Waiting for all requests to finish...')
}

if (require.main === module) {
    crawlAllData()
    process.on('SIGTERM', () => {
        console.info('SIGTERM signal received.');
        gracefulShutdown();
    });
    process.on('SIGINT', () => {
        console.info('SIGINT signal received.');
        gracefulShutdown();
    });
}