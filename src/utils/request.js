import fetch from '@system.fetch';
import storage from "@system.storage";
const md5 = require("md5");

function sign(o) {
  console.log("sign.o", o);
  let pre = "22It1Z6035kDl94V0vRh";
  let suf = "Ju0TE3w57fiJ68C75WP0kpTXe17qXt";
  console.log("o.data from sign", o.data);
  let k = Object.keys(o.data).sort();
  console.log("k", k);
  let t = "";
  for (var i = 0, j = k.length; i < j; i++) {
    t += k[i] + (function (v) {
      console.log("v", v);
      if (Array.prototype.isPrototypeOf(v) && v.length == 0) {
        return "[]";
      } else {
        return v;
      }
    })(o.data[k[i]]);
  }
  // console.log("t", t);
  let s = pre + t + suf;
  console.log(o.url.replace(api, ""), s);
  let m = md5(s);
  o.data = Object.assign(o.data, { sign: m });
  // console.log("o.data:",o.data)
  return o;
}

const requestHandle = (params) => {
  // console.log("requestHandle", params);
  // let sid;
  return new Promise((resolve, reject) => {
    // console.clear();
    storage.get({
      key: "sessionId",
      success(res) {
        if (res) {
          // console.log("res", res);
          params.data = Object.assign(params.data, { sessionId: res });
        }
        // },
        // fail() {
        //   console.log("fail");
        // },
        // complete() {
        //   console.log("complete", params);
        params = sign(params);
        // console.log(params);
        return fetch.fetch({
          url: params.url,
          // header: {
          //   cookie: "sid=" + params.data
          // },
          method: params.method,
          data: params.data || {},
          responseType: 'json',
        }).then(response => {
          const content = response.data.data;
          for (var i in content) {
            if (typeof content[i] != "object") {
              try {
                content[i] = JSON.parse(content[i]);
              } catch (err) {

              }
            }
          }
          return resolve(content)
        }).catch((error, code) => {
          // console.log(`🐛 request fail, code = ${code}`)
          console.log("params.url", params.url);
          return reject(error)
        })
      }
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
  // 'https://api.ubaycn.com/',
  // 'https://api0.ubaycn.com/',
  // 'https://test-api.ubaycn.com/',
  // 'http://192.168.1.157:7010/',
  'http://192.168.1.109:8090/',
  // 'http://192.168.43.187:8090/'
][0] + "ub/";
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
      // url: queryString(api + url, params),
      url: api + url,
      data: params
    })
  },
  // api: api,
  cap(phone) {
    console.log();
    // return false;
    // request.api + "login/cap?mobile=" + this.sms_phone;
    var ts = new Date().getTime();
    return api + "login/cap?time_stamp=" + ts + "&mobile=" + phone + "&sign=" + sign({
      data: {
        time_stamp: ts,
        mobile: phone
      }
    }).data.sign
  }
}
