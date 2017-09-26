const actConferenceConf=require('../config/actConferenceConf');//会议
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');

module.exports=function(socket, session){
	socket.on('actConference', function(data){
		logger.info(data['agentId'], '会议:', JSON.stringify(data));
		
		egine(data, actConferenceConf, config);
	})
}