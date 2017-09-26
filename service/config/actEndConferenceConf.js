const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//结束会议
			url:'',
			type:'',
			getParam:function(agent, conf, param, callblack){
				callblack.write('');
				callblack.end();
			},
			before:function(agent, agentStatus, param){
				return agent.url.replace(':agentid', param['agentId']);
			},
			execute:function(agent, agentStatus){
				
			},
			fail:function(param, agent, conf, data){
				logger.error("结束会议失败:", JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				//let user = session.getUser(agentId);
				data = data || err;
				data = JSON.parse(data);
				logger.info("结束会议:",data['retcode'] == 0)
				if(data['retcode'] == 0){//结束会议
				//	session.updateState([{'eventType':'','workNo':param['agentId']}], cpu.emit);
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}