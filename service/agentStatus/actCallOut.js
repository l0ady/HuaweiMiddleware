const actCallOutConf=require('../config/actCallOutConf');//外呼
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');

module.exports=function(socket, session){
	socket.on('actCallOut', function(data){
		logger.info(data['agentId'], '外呼 agentId:', JSON.stringify(data));
		
		egine(data, actCallOutConf, config);
	})
}