const actCancelHoldConf=require('../config/actCancelHoldConf');//取消保持
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');

module.exports=function(socket, session){
	socket.on('actCancel', function(data){
		logger.info(data['agentId'], '取消保持:', JSON.stringify(data));
		
		egine(data, actCancelHoldConf, config);
	})
}