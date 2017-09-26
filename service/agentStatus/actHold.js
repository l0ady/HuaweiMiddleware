const actHoldConf=require('../config/actHoldConf');//保持
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');

module.exports=function(socket, session){
	socket.on('actHold', function(data){
		logger.info(data['agentId'], '保持:', JSON.stringify(data));
		
		egine(data, actHoldConf, config);
	})
}