const actSignOutConf=require('../config/actSignOutConf');//签出
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');

module.exports=function(socket, session){
	socket.on('actSignout', function(data){
		if(data['agentId'] !== void 0){
			logger.info(data['agentId'], '签出:', JSON.stringify(data));
			debugger;
			egine(data, actSignOutConf, config);
		}else{
			logger.error(socket.id, '签出 fail', JSON.stringify(data));
		}
	})
}



