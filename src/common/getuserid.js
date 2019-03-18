const device = require('@system.device')
const prompt = require('@system.prompt');
const crypto = require('crypto');
module.exports = (cb) => {
	device.getId({
		type: ['device', 'mac','user'],
		success: function(data) {
			//sid采用IMEI+salt的方式取md5
			let key = `${data.device}_youbencn_yjf`;
			data.sid = crypto.createHash('md5').update(data.device).digest('hex');
			cb(data);
			console.log(`handling success: ${data.device}`);
			// global.IMEI = data.device;
		},
		fail: function(data, code) {
			cb(code);
			console.log(`handling fail, code = ${code}`)
		}
	});
}