const cpu = require('../cpu');
const session = require('../session/session').session;
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//会议
			url:'/agentgateway/resource/voicecall/:agentid/confjoin',
			type:'POST',
			getParam:function(agent, conf, param, callblack){
				callblack.write(JSON.stringify({
					'callid' : param['callid'],
					'callappdata': param['callappdata']
				}));
				callblack.end();
			},
			before:function(agent, agentStatus, param){
				return agent.url.replace(':agentid', param['agentId']);
			},
			execute:function(agent, agentStatus){
				
			},
			fail:function(param, agent, conf, data){
				logger.error("会议失败:", JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				
				data = data || err;
				data = JSON.parse(data);
				logger.info("会议:",data['retcode'] == 0)
				if(data['retcode'] == 0){//会议不会返回callid
				//	session.updateState([{'eventType':'','workNo':param['agentId']}], cpu.emit);
				//cpu.emit(session.getUser(param['agentId'])['socketId'], {'eventType':'AgentEvent_Call_Release', 'content':{data['result']}}, param['agentId']);
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}