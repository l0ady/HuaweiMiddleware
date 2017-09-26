const actPhoneLinkageAnswerConf=require('../config/actPhoneLinkageAnswerConf');//话机联动应答
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');

module.exports=function(socket, session){
	socket.on('actPhoneLinkageAnswer', function(data){
		logger.info(data['agentId'], '应答:', JSON.stringify(data));
		
		egine(data, actPhoneLinkageAnswerConf, config);
	})
}