const actConsultConf=require('../config/actConsultConf');//咨询
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');

module.exports=function(socket, session){
	socket.on('actConsult', function(data){
		logger.info(data['agentId'], '咨询:', JSON.stringify(data));
		if(data === void 0 || data['dstaddress'] === void 0){
			logger.error(' 咨询 param fail');
		}else{
			if(data['devicetype'] === void 0) data['devicetype']=2;
			if(data['mode'] === void 0) data['mode']=1;
			if(data['callappdata'] === void 0) data['callappdata']='';
			egine(data, actConsultConf, config);
		}
	})
}
