const actBusyConf=require('../config/actBusyConf');//置忙
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');

module.exports=function(socket, session){
	socket.on('actBusy', function(data){
		if(data['agentId'] !== void 0){
			logger.info(data['agentId'], '置忙:', JSON.stringify(data));
			egine(data, actBusyConf, config);
		}else{
			logger.error(socket.id, '置忙 fail', JSON.stringify(data));
		}
	})
}



