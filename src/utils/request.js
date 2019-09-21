import fetch from '@system.fetch';
import storage from "@system.storage";

const requestHandle = (params) => {
  let sid;
  return new Promise((resolve, reject) => {
    storage.get({
      key: "sessionId",
    }).then(res => {
      console.log("request success");
      return fetch.fetch({
        url: params.url,
        header: {
          cookie: `sid=${res.data}`
        },
        method: params.method,
        data: params.data || {},
        responseType: 'json',
      }).then(response => {
        const content = response.data.data
        if (typeof content.data != "object") {
          content.data = JSON.parse(content.data);
        }
        return resolve(content)
      }).catch((error, code) => {
        console.log(`🐛 request fail, code = ${code}`)
        return reject(error)
      })
    }).catch(res => {
      return fetch.fetch({
        url: params.url,
        method: params.method,
        data: params.data || {},
        responseType: 'json',
      }).then(response => {
        const result = response.data
        const content = result.data
        return resolve(content)
      }).catch((error, code) => {
        console.log(`🐛 request fail, code = ${code}`)
        return reject(error)
      })
    })

  })
}
function queryString(url, query) {
  let str = []
  for (let key in query) {
    if (typeof query[key] === 'object') {
      query[key] = JSON.stringify(query[key])
    }
    str.push(key + '=' + query[key])
  }
  let paramStr = str.join('&')
  return paramStr ? `${url}?${paramStr}` : url
}
const environment = ["test", "yanzheng", "duli", ""][0];
const api = [
  'https://api.ubaycn.com/',
  'https://test-api.ubaycn.com/',
  'http://192.168.1.157:7010/',
  'http://192.168.1.109:8090/'
][3] + "ub/";
export default {
  post: function (url, params) {
    params = Object.assign({ environment: environment }, params);
    return requestHandle({
      method: 'post',
      url: api + url,
      data: params
    })
  },
  get: function (url, params) {
    params = Object.assign({ environment: environment }, params);
    return requestHandle({
      method: 'get',
      url: queryString(api + url, params)
    })
  },
  api: api
}
