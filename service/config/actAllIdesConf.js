const cpu = require('../cpu');
const session = require('../session/session').session;
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//所有空闲坐席
			url:'/agentgateway/resource/agentgroup/:agentid/idleagent',
			type:'GET',
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
				logger.error("所有空闲坐席失败:", JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				/*
				 *	{"message":"","retcode":"0","result":[{"workno":"156","name":"156"}]}
				 */
				data = data || err;
				data = JSON.parse(data);
				logger.info("所有空闲坐席:",data['retcode'] == 0)
				if(data['retcode'] == 0){
					cpu.emit(session.getUser(param['agentId'])['socketId'], data['result'], 'actAllIdes')
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}