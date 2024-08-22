import cron from 'node-cron';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import config from './config';

// Config axios retry for all requests

axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.linearDelay(config.delayPerRetry)
});

console.log("it's work")

const tasks: cron.ScheduledTask[] = []


const testTask = cron.schedule('* * * * * *', () => {
    console.log('running a task every second');
});
tasks.push(testTask)

process.on('SIGTERM', () => {
    tasks.forEach(task => task.stop())
    console.info('SIGTERM signal received.');
});

process.on('SIGINT', () => {
    tasks.forEach(task => task.stop())
    console.info('SIGINT signal received.');
});