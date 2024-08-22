import axios from "axios";
import { parse } from 'node-html-parser';


async function getStationList() {
    const { data } = await axios.post("https://enviinfo.cem.gov.vn/eip/default/call/json/get_station_by_conditions", {
        station_type: 4,
        from_public: 1,
    })
    
    if(!data.success) {
        throw new Error("Failed to get station list")
    }

    const html = parse(data.html as string)

    if(html === undefined) {
        throw new Error("Failed to parse html response data")
    }
    
    const listOption = html.querySelectorAll('option[data-id]') 

    const stationList = listOption.map(element => {
        return {
            id: element.getAttribute('data-id') as string,
            name: element.innerText,
            lat: element.getAttribute('data-lat') as string,
            lon: element.getAttribute('data-lon') as string,
            province: element.getAttribute('data-province') as string,
            address: element.getAttribute('data-address') as string,
            _attributes: element.attributes 
        }
    })

    return stationList

}

export default getStationList


// DEBUG
if (require.main === module) {
    getStationList()
        .then(data => console.log(data))
}