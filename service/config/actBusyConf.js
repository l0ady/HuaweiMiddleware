const cpu = require('../cpu');
const session = require('../session/session').session;
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//置忙
			url:'/agentgateway/resource/onlineagent/:agentid/saybusy',
			type:'POST',
			getParam:function(agent, conf, param, callblack){
				callblack.write("");
				callblack.end();
			},
			before:function(agent, conf, param){
				return agent.url.replace(':agentid', param['agentId']);
			},
			execute:function(){},
			fail:function(param, agent, conf, data){
				logger.error("置忙失败:"+JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				//示忙成功(AgentState_SetNotReady_Success)
				data = data || err;
				data = JSON.parse(data);
				logger.info("置忙:",data['retcode'] == 0)
				if(data['retcode'] == "0"){
					logger.info("置忙成功:"+JSON.stringify(data));
					//1.修改user的状态 2.发射状态给客户端
					//session.updateState([{'eventType':'AgentState_Busy','workNo':param['agentId']}], cpu.emit);
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}