const actEndRestConf=require('../config/actEndRestConf');//取消休息
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');

module.exports=function(socket, session){
	socket.on('actEndRest', function(data){
		logger.info(data['agentId'], '取消休息:', JSON.stringify(data));
		
		egine(data, actEndRestConf, config);
	})
}