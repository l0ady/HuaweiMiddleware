const cpu = require('../cpu');
const session = require('../session/session').session;
const egine=require('../TOAgentGateway/engine');
const actRestSkill = require('./actRestSkill');//强制签入
const err = require('../../err').ERR;
const logger = require('../../tool').logger('logger');

module.exports={//查询当前坐席的技能组
			url:'/agentgateway/resource/onlineagent/:agentid/agentskills',
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
				logger.error("当前坐席的技能组查询失败:", JSON.stringify(data));
			},
			success:function(param, agent, conf, data){
				data = data || err;
				data = JSON.parse(data);
				logger.info("当前坐席的技能组查询:",data['retcode'] == 0)
				if(data['retcode'] == 0){
					logger.info(param['agentId'], JSON.stringify(data));
					egine(param, actRestSkill, conf);//查询技能组
				}else{
					agent.fail(param, agent, conf, data);
				}
			}
		}