const cpu = require('../cpu');
const session = require('../session/session').session;
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//应答
			url:'/agentgateway/resource/voicecall/:agentid/answer',
			type:'PUT',
			getParam:function(agent, conf, param, callblack){
				callblack.write("");
				callblack.end();
			},
			before:function(agent, agentStatus, param){
				return agent.url.replace(':agentid', param['agentId']);
			},
			execute:function(agent, agentStatus){
				
			},
			fail:function(param, agent, conf, data){
				logger.error("应答失败:", JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				
				data = data || err;
				data = JSON.parse(data);
				logger.info("应答:",data['retcode'] == 0)
				if(data['retcode'] == 0){
					//session.updateState([{'eventType':'AgentEvent_Talking','workNo':param['agentId']}], cpu.emit);
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}