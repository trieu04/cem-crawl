import axios from "axios";
import axiosRetry from "axios-retry";

const axiosWithRetry = axios.create();

axiosRetry(axiosWithRetry, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay
});

export default axiosWithRetry;