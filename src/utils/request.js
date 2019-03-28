import fetch from '@system.fetch';
import storage from"@system.storage";

const  requestHandle = (params)  => {
    // console.log(fetch)

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
      return requestHandle({
        method: 'post',
        url: `http://192.168.1.111:7010/${url}`,
        data: params
      })
    },
    get: function(url, params) {
      return requestHandle({
        method: 'get',
        url: queryString(`http://192.168.1.111:7010/${url}`, params),
        data:{},
      })
    }
  }
