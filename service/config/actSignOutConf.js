const cpu = require('../cpu');
const session = require('../session/session').session;
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//签出
			url:'/agentgateway/resource/onlineagent/:agentid/logout',
			type:'DELETE',
			getParam:function(agent, conf, param, callblack){
				callblack.write('');
				callblack.end();
			},
			before:function(agent, conf, param){
				debugger
				return agent.url.replace(':agentid', param['agentId']);
			},
			execute:function(status, agentStatus){
				
			},
			fail:function(param, agent, conf, data){
				logger.error("签出失败:",JSON.stringify(data))
			},
			success:function(param, agent, conf, data){
				//座席签出成功（Provider Shutdown Service）1.删除guid
				data = data || err;
				data = JSON.parse(data);
				logger.info("签出:",data['retcode'] == 0)
				if(data.retcode == "0"){
					//修改当前状态为未签入状态
					session.updateState([{'eventType':'AgentOther_ShutdownService','workNo':param['agentId']}], cpu.emit);
					session.clearCache(param['agentId']);
				}else if(data.retcode == '100-006'){//坐席未签入
					session.updateState([{'eventType':'AgentOther_ShutdownService','workNo':param['agentId']}], cpu.emit);
					session.clearCache(param['agentId']);
					agent.fail(param, agent, conf, data);
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}