/*获取随路数据*/
const actGetcalldataConf=require('../config/actGetcalldataConf');
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');

module.exports=function(socket, session){
	socket.on('actGetcalldata', function(data){
		logger.info(data['agentId'], '获取随路数据:', JSON.stringify(data));
		egine(data, actGetcalldataConf, config);
	})
}
