const actRest=require('../config/actRestConf');//休息
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');

module.exports=function(socket, session){
	socket.on('actRest', function(data){
		logger.info(data['agentId'], '休息:', JSON.stringify(data));
		
		egine(data, actRest, config);
	})
}