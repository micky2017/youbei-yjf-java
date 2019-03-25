import fetch from '@system.fetch';

function requestHandle(params) {
    // console.log(fetch)
    return new Promise((resolve, reject) => {
      fetch.fetch({
        url: params.url,
        method: params.method,
        data: params.data || {},
        responseType: 'json',
      }).then(response => {
        const result = response.data
        const content = result.data
        return content.code === 200 ? resolve(content) : resolve(content.message)
      }).catch((error, code) => {
        console.log(`🐛 request fail, code = ${code}`)
        return reject(error)
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
        url: `http://192.168.31.124:7010/${url}`,
        data: params
      })
    },
    get: function(url, params) {
      return requestHandle({
        method: 'get',
        url: queryString(`http://192.168.31.124:7010/${url}`, params),
        data:{},
      })
    }
  }
