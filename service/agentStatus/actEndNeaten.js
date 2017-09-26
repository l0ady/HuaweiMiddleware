const actEndNeatenConf=require('../config/actEndNeatenConf');//结束整理
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');

module.exports=function(socket, session){
	socket.on('actEndNeaten', function(data){
		logger.info(data['agentId'], '结束整理:', JSON.stringify(data));
		
		egine(data, actEndNeatenConf, config);
	})
}