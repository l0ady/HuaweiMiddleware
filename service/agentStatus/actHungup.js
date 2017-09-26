const actHungupConf=require('../config/actHungupConf');//挂机
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');

module.exports=function(socket, session){
	socket.on('actHungup', function(data){
		logger.info(data['agentId'], '挂机:', JSON.stringify(data));
		
		egine(data, actHungupConf, config);
	})
}



