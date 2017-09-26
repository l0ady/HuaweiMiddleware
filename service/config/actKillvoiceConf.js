const cpu = require('../cpu');
const session = require('../session/session').session;
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//结束话路
			url:'/agentgateway/resource/voicecall/:agentid/dropcall/:callid',
			type:'POST',
			getParam:function(agent, conf, param, callblack){
				callblack.write('');
				callblack.end();
			},
			before:function(agent, conf, param){
				return agent.url.replace(':agentid', param['agentId']).replace(':callid', param['callid']);
			},
			execute:function(status, agentStatus){
				
			},
			fail:function(param, agent, conf, data){
				logger.error("结束话路失败:",JSON.stringify(data))
			},
			success:function(param, agent, conf, data){
				//座席签出成功（Provider Shutdown Service）1.删除guid
				/*
					结束话路失败: {"message":"no call can be droped","retcode":"200-025"}
				*/
				data = data || err;
				data = JSON.parse(data);
				logger.info("结束话路:",data['retcode'] == 0)
				if(data.retcode == "0" || data.retcode == '200-025'){
					//结束话路以后应该是什么状态?
				//	session.updateState([{'eventType':'AgentOther_ShutdownService','workNo':param['agentId']}], cpu.emit);
				}else{
					agent.fail(param, agent, conf, data);	
				}
			}
		}