const cpu = require('../cpu');
const session = require('../session/session').session;
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//保持
			url:'/agentgateway/resource/voicecall/:agentid/hold',
			type:'POST',
			getParam:function(agent, conf, param, callblack){
				callblack.write('');
				callblack.end();
			},
			before:function(agent, conf, param){
				return agent.url.replace(':agentid', param['agentId']);
			},
			//执行三方通话
			execute:function(){
				
			},
			fail:function(param, agent, conf, data){
				logger.error('保持失败:', JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				data = data || err;
				data = JSON.parse(data);
				logger.info("保持:",data['retcode'] == 0);
				if(data['retcode'] == "0"){
					logger.info("保持成功:"+JSON.stringify(data));
					//session.updateState([{'eventType':'AgentEvent_Hold','workNo':param['agentId']}], cpu.emit);
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}