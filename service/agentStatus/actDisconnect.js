const actSignOutConf=require('../config/actSignOutConf');//签出
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');

module.exports=function(socket, session){
	socket.on('disconnect', function(data){
		//用户断开连接以后,获取该工号 然后执行签出操作
		session.finishSocketId(socket.id, function(agentId){
			logger.info(socket.id,"socket断开连接自动签出:", agentId);
			if(agentId !== void 0){
				egine({'agentId':agentId}, actSignOutConf, config);
			}
		});
	})
}