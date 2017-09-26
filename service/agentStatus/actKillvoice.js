const actKillvoiceConf=require('../config/actKillvoiceConf');//结束话路
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');

module.exports=function(socket, session){
	socket.on('actKillvoice', function(data){
		logger.info(data['agentId'], '结束话路:', JSON.stringify(data));
		
		egine(data, actKillvoiceConf, config);
	})
}



