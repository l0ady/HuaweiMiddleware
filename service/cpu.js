const session = require('./session/session').session;
const logger = require('../tool').logger('logger');

module.exports=(function(){
		let io='';
		function cpu(socketId, event, agentId){
			if(!!io){			
				//io.sockets[socketId].emit(agentId, event);
				logger.info('before socketId:'+socketId+';');
				if(io.sockets.connected[socketId] && io.sockets.connected[socketId].emit){
					logger.info('after socketId:'+socketId+';agentId:'+agentId+';event;'+JSON.stringify(event));
					io.sockets.connected[socketId].emit(agentId, event);
				}else{
					logger.error('socketId fail ! ');
				}
			}else{
				logger.error('io is null in cpu ...');
			}
		}
		function broadcast(key, mess){
			if(!!io.sockets){
				io.sockets.emit(key, mess);
			}
		}
		function setIo(nio){
			io=nio;
		}
		return {
			emit:cpu,
			setIo:setIo,
			broadcast:broadcast
		}
	})()

