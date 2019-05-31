import fetch from '@system.fetch';
import storage from '@system.storage';

const statis = (event_id,event_params,that) => {
    storage.get({
        key:'external',
        success:(data) => {
            if(data){
                fetchStatis(event_id,event_params,that,data)
            }else{
                fetchStatis(event_id,event_params,that)
            }
        },
        fail: (err) => {
            fetchStatis(event_id,event_params,that)
        }
    })
    
    

}
const fetchStatis = (event_id,event_params,that,sourceData) => {
    const versionName = that.$app.$def.manifest.versionName;
    const params = JSON.parse(JSON.stringify(event_params))
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const element = params[key];
            params[key] = `${key}是${element}`
        }
    }
    params.versionName = `版本${versionName.split('.').join('0')}`;
    if(sourceData){
        params.utm_source = sourceData;
    }else{
        params.utm_source = "master";
    }
    const data = JSON.stringify(params)
    APP_STATISTICS.track_event(event_id, params);
    fetch.fetch({
        url: `${that.$app.$data.logUrl}?event=${event_id}&data=${data}&tag=云缴费`,
    })
}
export default {
    statis
}