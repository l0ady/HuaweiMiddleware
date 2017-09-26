/*设置随路数据*/
const actSetcalldataConf=require('../config/actSetcalldataConf');
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');

module.exports=function(socket, session){
	socket.on('actSetcalldata', function(data){
		logger.info(data['agentId'], '设置随路数据:', JSON.stringify(data));
		egine(data, actSetcalldataConf, config);
	})
}
