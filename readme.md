# enviinfo.cem.gov.vn AIR DATA CRAWL

## Usage

### Installation
First, clone this repo and install dependencies

```
git clone https://github.com/trieu04/cem-crawl.git
cd cem-crawl
npm install
```

> **Note**
> The command below runs without build.

### Crawl station list

```
npm run crawl:station
```
After this command is successful, crawled data will be stored in `./storage/crawl/station-list/{{date}}_{{time}}.csv` and `./storage/crawl/station-list/{{date}}_{{time}}.json`

### Crawl hourly air data in last 24 hour 

```
npm run crawl:air24h
```

After this command is successful, crawled data will be stored in `./storage/crawl/air-hourly/{{stationID}}.csv`

### Crawl daily air data in last 30 days 

```
npm run crawl:air30d
```

After this command is successful, crawled data will be stored in `./storage/crawl/air-daily/{{stationID}}.csv`

