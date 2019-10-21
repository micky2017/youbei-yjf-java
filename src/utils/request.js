import fetch from '@system.fetch';
import storage from "@system.storage";

const requestHandle = (params) => {
  let sid;
  return new Promise((resolve, reject) => {
    storage.get({
      key: "sessionId",
    }).then(res => {
      params.data = Object.assign(params.data, { sessionId: res.data });
      return fetch.fetch({
        url: params.url,
        header: {
          cookie: `sid=${res.data}`
        },
        method: params.method,
        data: params.data || {},
        responseType: 'json',
      }).then(response => {
        const content = response.data.data;
        for (var i in content) {
          if (typeof content[i] == "string") {
            try {
              content[i] = JSON.parse(content[i]);
            } catch (err) {

            }
          }
        }
        return resolve(content)
      }).catch((error, code) => {
        console.log(`🐛 request fail, code = ${code}`)
        console.log("params.url", params.url);
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
        if (typeof content.data != "object") {
          content.data = JSON.parse(content.data);
        }
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
const environment = ["test", "yanzheng", "duli", "prod", ""][3];
const api = [
  'https://api.ubaycn.com/',
  'https://api0.ubaycn.com/',
  'https://test-api.ubaycn.com/',
  'http://192.168.1.157:7010/',
  'http://192.168.1.109:8090/',
  'http://192.168.43.187:8090/'
][1] + "ub/";
export default {
  post: function (url, params) {
    params = Object.assign({ environment: environment }, params);
    console.log("url & params", url, params);
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
