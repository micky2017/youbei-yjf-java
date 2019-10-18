import fetch from '@system.fetch';
import storage from"@system.storage";
const md5 = require('md5');

const  requestHandle = (params)  => {
    console.log(params);
    // // 路径获取
    // let psrc = params.url
    // let pmtd = params.method

    // // 签名认证
    // let newdate ="";
    // let data = params.data;
    // let first = "22It1Z6035kDl94V0vRh"
    // let last = "Ju0TE3w57fiJ68C75WP0kpTXe17qXt"
    // console.log("输出最初的字典元素: "+data); 
    // for(var key in data){
    //     console.log("key: " + key + " ,value: " + data[key]);
    // }
    // // 参数拼接
    // let res = Object.keys(data).sort(); 	
    // console.log("字典元素按照key值排序之后: "+res); 
    // for(var key = 0; key < res.length; key++){
    //     console.log("key: " + res[key] + " ,value: " + data[res[key]]);
    //     newdate += res[key] + data[res[key]]
    // }
    // console.log(typeof newdate,newdate);
    // let singa = first+newdate+last;
    // console.log(singa);
    // // MD5加密
    // let mdmsg = md5(singa)
    // console.log(mdmsg)
    // params = Object.assign(data,{sign:mdmsg})

    
    let sid;
    return new Promise((resolve, reject) => {
      storage.get({
        key:"sid",
      }).then(res => {
        console.log("storage获得的sid",resolve,reject);
        console.log("请求的参数值",params)
        return fetch.fetch({
            // url: params.url,
            url: psrc,
            header: {
              cookie: `sid=${res.data}`
            },
            // method: params.method,
            method: pmtd,
            // data: params.data || {},
            data: params,
            responseType: 'json',
          }).then(response => {
            console.log("成功之后的参数"+response);
            const result = response.data
            const content = result.data
            return  resolve(content)
          }).catch((error, code) => {
            console.log(error)
            // console.log(`🐛 request fail, code = ${error}`)
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
    console.log("get方法的参数",url,query);
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
        method: 'POST',
        // url: `https://api.ubaycn.com/${url}`,
        // url: `https://test-api.ubaycn.com/${url}`,
        url: `https://t.ubaycn.com/ub/${url}`,
        // url: `http://192.168.1.140:8090/ub/${url}`,
        data: params
      })
    },
    get: function(url, params) {
      return requestHandle({
        method: 'GET',
        // url: `http://192.168.1.140:8090/ub/${url}`,
        url: `https://t.ubaycn.com/ub/${url}`,
        // url: `https://test-api.ubaycn.com/${url}`,
        // url: `https://api.ubaycn.com/${url}`,
        data:params,
      })
    }
    // https://192.168.8.117:7010/
  }
