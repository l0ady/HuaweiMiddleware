const actSignInConf=require('../config/actSignInConf');//签入
const config=require('../config/config');
const egine=require('../TOAgentGateway/engine');
const logger = require('../../tool').logger('logger');
//当前用户的所有信息:工号 分机号 密码(可以为空) 签入自动置忙 整理后自动置忙 socketId
module.exports=function(socket, session){
	socket.on('actSignIn', function(data){
		try{
			data['socketId']=socket.id;
			logger.info(data['agentId'], '签入:', JSON.stringify(data));
			session.saveUser(data, function(param){
				egine(param, actSignInConf, config);
			});
		}catch(err){
			logger.error(err);
			//session.customEven([{"eventType": "ERROR", "workNo": param['agentId'], "content": data}], cpu.emit);
			socket.emit('ERROR', err.message);//
		}
		
	})
}



