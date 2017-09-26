const actIdleConf=require('../config/actIdleConf');//空闲
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');

module.exports=function(socket, session){
	socket.on('actIdle', function(data){
		if(data['agentId'] !== void 0){
			logger.info(data['agentId'], '空闲:', JSON.stringify(data));
			egine(data, actIdleConf, config);
		}else{
			logger.error(socket.id, '空闲fail:', JSON.stringify(data));
		}
	})
}



