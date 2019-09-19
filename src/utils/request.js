import fetch from '@system.fetch';
import storage from "@system.storage";

const requestHandle = (params) => {
  let sid;
  return new Promise((resolve, reject) => {
    /*
    storage.get({
      key: "sid",
      success: function (o) {
        console.log("get sid success", "[" + o + "]");
      },
      fail: function (o) {
        console.log("get sid fail", o);
      }
    });
    return false;
    /**/
    storage.get({
      key: "sid",
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
        const result = response.data
        const content = result.data
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





/*
import fetch from '@system.fetch';
import storage from"@system.storage";

const  requestHandle = (params)  => {
    // if(params.data){
    //   params.data.testpackage = "test";
    // }else{
    //   params.url = params.url.indexOf('?') != -1 ? `${params.url}&testpackage=test` : `${params.url}?testpackage=test`
    // }
    // if(params.data){
    //   params.data.environment = "duli";
    // }else{
    //   params.url = params.url.indexOf('?') != -1 ? `${params.url}&environment=duli` : `${params.url}?environment=duli`
    // }
    let sid;
    return new Promise((resolve, reject) => {
      storage.get({
        key:"sid",
      }).then(res => {
        return fetch.fetch({
            url: params.url,
            header: {
              cookie: `sid=${res.data}`
            },
            method: params.method,
            data: params.data || {},
            responseType: 'json',
          }).then(response => {
            const result = response.data
            const content = result.data
            return  resolve(content)
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
          return  resolve(content)
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

  export default {
    post: function(url, params) {
      // params.environment = "test"
      // params.environment = "duli";
      // params = Object.assign(params,{environment:'duli'})
      // params.environment = "yanzheng"
      // params.testpackage = 'test'
      return requestHandle({
        method: 'post',
        // url: `https://api.ubaycn.com/${url}`,
        // url: `https://test-api.ubaycn.com/${url}`,
        // url: `http://192.168.1.157:7010/${url}`,
        url: `http://192.168.1.109:8090/ub/${url}`,
        data: params
      })
    },
    get: function(url, params) {
      // params = Object.assign(params,{environment:'duli'})
      // params.environment = "test"
      // params.environment = "duli";
      // params.environment = "yanzheng"
      // params.testpackage = 'test'
      return requestHandle({
        method: 'get',
        url: queryString(`http://192.168.1.109:8090/ub/${url}`, params),
        // url: queryString(`http://192.168.1.157:7010/${url}`, params),
        // url: queryString(`https://test-api.ubaycn.com/${url}`, params),
        // url: queryString(`https://api.ubaycn.com/${url}`, params),
        data:{},
      })
    },
    // https://192.168.8.117:7010/
  }
/**/
