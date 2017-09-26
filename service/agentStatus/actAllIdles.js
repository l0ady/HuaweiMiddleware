const actAllIdesConf=require('../config/actAllIdesConf');//所有空闲坐席
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');

module.exports=function(socket, session){
	socket.on('actAllIdes', function(data){
		logger.info(data['agentId'], '所有空闲坐席:', JSON.stringify(data));
		
		egine(data, actAllIdesConf, config);
	})
}
